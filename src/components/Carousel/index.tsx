"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Card,
  Button,
  Fade,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSwipeable } from "react-swipeable";

export interface ICarouselProps {
  items: React.ReactElement[];
}

export default function Carousel({ items }: ICarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const theme = useTheme();

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePrevPage(),
    trackMouse: true, // permite swipe com mouse também
  });

  // Breakpoints padrão MUI:
  // xs: 0-600, sm: 600-900, md: 900-1200, lg: 1200-1536, xl: >1536
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm")); // até 600px
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600 - 900
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900 - 1200

  // Quantidade de cards por página conforme o tamanho da tela
  const cardsPerPage = isXsScreen ? 1 : isSmScreen ? 2 : isMdScreen ? 3 : 4;

  const totalPages = Math.ceil(items.length / cardsPerPage);

  const changePage = (newPage: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentPage(newPage);
      setFadeIn(true);
    }, 200);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage + 1) % totalPages;
    changePage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = (currentPage - 1 + totalPages) % totalPages;
    changePage(prevPage);
  };

  const handleDotClick = (index: number) => {
    if (index !== currentPage) {
      changePage(index);
    }
  };

  const currentCards = items.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        overflow: "visible",
      }}
    >
      <Box
        {...handlers}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 2,
          overflow: "visible",
          padding: "0px 0",
        }}
      >
        <IconButton onClick={handlePrevPage} aria-label="Página anterior">
          <NavigateBeforeIcon />
        </IconButton>

        <Fade in={fadeIn} timeout={300} style={{ width: "100%" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "center",
              flexWrap: "nowrap",
              overflow: "visible",
            }}
          >
            {currentCards?.map((card, index) => (
              <Box
                key={index}
                sx={{
                  flex: `0 0 calc(${100 / cardsPerPage}% `,
                  width: `calc(${100 / cardsPerPage}% `,
                  maxWidth: `calc(${100 / cardsPerPage}% `,
                  padding: "0 8px",
                  boxSizing: "border-box",
                }}
              >
                {card}
              </Box>
            ))}
          </Stack>
        </Fade>

        <IconButton onClick={handleNextPage} aria-label="Próxima página">
          <NavigateNextIcon />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
        {Array.from({ length: totalPages }).map((_, index) => {
          const isActive = currentPage === index;
          return (
            <Button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para página ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              sx={{
                minWidth: isXsScreen ? 10 : 14,
                height: isXsScreen ? 10 : 14,
                borderRadius: "50%",
                padding: 0,
                backgroundColor: isActive ? "primary.main" : "grey.400",
                transform: isActive ? "scale(1.4)" : "scale(1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                  backgroundColor: isActive ? "primary.dark" : "grey.500",
                },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
