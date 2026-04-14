"use client";

import Carousel from "@/components/Carousel";

interface CarouselWrapperProps {
  items: React.ReactElement[];
}

export function CarouselWrapper({ items }: CarouselWrapperProps) {
  return <Carousel items={items} />;
}
