"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  getCompanyAction,
  getStockAction,
  getStockHistoryAction,
} from "@/actions/bloodstock/bloodstock-actions";
import { getMyInstitutionAction } from "@/app/(main)/hemocentros/actions";
import { Company } from "@/lib/api";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";
import { IBloodstockItem, IBloodstockMovement } from "@/features/BloodStock/interfaces/Bloodstock.interface";
import { IAppointment } from "@/features/Institution/interfaces/Appointment.interface";
import { IInstitution } from "@/features/Institution/interfaces/Institution.interface";
import { ICampaign, CampaignStatus } from "@/features/Campaign/interfaces/Campaign.interface";
import { getCurrentUserClient } from "@/utils/auth.client";
import type { IAuthUser } from "@/interfaces/User.interface";
import { logger } from "@/utils/logger";

export type HemocentroData = {
  stocks: IBloodstockItem[];
  stockHistory: IBloodstockMovement[];
  currentCompany: Company | null;
  institution: IInstitution | null;
  appointments: IAppointment[];
  campaigns: ICampaign[];
  historicalCampaigns: ICampaign[];
  user: IAuthUser | null;
  isLoading: boolean;
  isLoadingHistory: boolean;
  isLoadingAppointments: boolean;
  isLoadingCampaigns: boolean;
  error: string;
  visibleHistoryCount: number;
  setVisibleHistoryCount: Dispatch<SetStateAction<number>>;
  refreshAfterStockUpdate: (updatedStocks: IBloodstockItem[]) => Promise<void>;
};

export function useHemocentroData(): HemocentroData {
  const [stocks, setStocks] = useState<IBloodstockItem[]>([]);
  const [stockHistory, setStockHistory] = useState<IBloodstockMovement[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [institution, setInstitution] = useState<IInstitution | null>(null);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [historicalCampaigns, setHistoricalCampaigns] = useState<ICampaign[]>([]);
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [error, setError] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(10);

  useEffect(() => {
    let cancelled = false;
    getCurrentUserClient().then((u) => {
      if (!cancelled) setUser(u);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const companyData = await getCompanyAction();
        if (cancelled) return;
        setCurrentCompany(companyData);

        // Fetch full institution profile (phone, whatsapp, address, schedule, etc.)
        getMyInstitutionAction()
          .then((data) => { if (!cancelled) setInstitution(data); })
          .catch((err) => { if (!cancelled) logger.error("Erro ao carregar instituição:", err); });

        const stockData = await getStockAction();
        if (cancelled) return;
        setStocks(stockData);

        setIsLoadingHistory(true);
        getStockHistoryAction()
          .then((data) => { if (!cancelled) setStockHistory(data); })
          .catch((err) => { if (!cancelled) { logger.error("Erro histórico:", err); setStockHistory([]); } })
          .finally(() => { if (!cancelled) setIsLoadingHistory(false); });

        if (isFeatureEnabled("appointments")) {
          setIsLoadingAppointments(true);
          const { getAppointmentsByCompany } = await import("@/lib/api");
          getAppointmentsByCompany(companyData.id)
            .then((data) => { if (!cancelled) setAppointments(data); })
            .catch((err) => { if (!cancelled) { logger.error("Erro agendamentos:", err); setAppointments([]); } })
            .finally(() => { if (!cancelled) setIsLoadingAppointments(false); });
        }

        if (isFeatureEnabled("campaigns")) {
          setIsLoadingCampaigns(true);
          const { campaignClientService } = await import("@/features/Campaign/services/campaign.client.service");
          campaignClientService.getAllCampaignsByInstitution(companyData.id)
            .then((data) => {
              if (cancelled) return;
              const active = data.filter((c) => c.status === CampaignStatus.ACTIVE);
              const historical = data.filter((c) => c.status !== CampaignStatus.ACTIVE);
              setCampaigns(active);
              setHistoricalCampaigns(historical);
            })
            .catch((err) => {
              if (cancelled) return;
              logger.error("Erro campanhas:", err);
              setCampaigns([]);
              setHistoricalCampaigns([]);
            })
            .finally(() => { if (!cancelled) setIsLoadingCampaigns(false); });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  const refreshAfterStockUpdate = async (updatedStocks: IBloodstockItem[]) => {
    setStocks(updatedStocks);
    setIsLoadingHistory(true);
    try {
      const history = await getStockHistoryAction();
      setStockHistory(history);
      setVisibleHistoryCount(10);
    } catch (err) {
      logger.error("Erro ao recarregar histórico:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return {
    stocks,
    stockHistory,
    currentCompany,
    institution,
    appointments,
    campaigns,
    historicalCampaigns,
    user,
    isLoading,
    isLoadingHistory,
    isLoadingAppointments,
    isLoadingCampaigns,
    error,
    visibleHistoryCount,
    setVisibleHistoryCount,
    refreshAfterStockUpdate,
  };
}
