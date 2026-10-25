"use client";
import { useEffect } from "react";

/** Marks <html> as the aerospace world so page edges, scrollbars and overscroll match the blue theme. */
export default function WorldMarker() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.world = "aero";
    return () => {
      delete html.dataset.world;
    };
  }, []);
  return null;
}
