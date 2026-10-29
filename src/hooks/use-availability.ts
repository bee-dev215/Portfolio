import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBusy } from "@/lib/bookingApi";
import { openSlots, slotWindow } from "@/lib/booking-time";

export const AVAILABILITY_KEY = ["availability"] as const;

/**
 * The call times still open, soonest first, checked again every minute.
 * If the database can't be reached, every time in working hours shows as open (bookings then arrive by email).
 */
export function useAvailability() {
  const busy = useQuery({
    queryKey: AVAILABILITY_KEY,
    queryFn: () => {
      const { from, to } = slotWindow();
      return fetchBusy(from, to);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
  const slots = useMemo(() => openSlots(busy.data ?? []), [busy.data]);
  return { slots, loading: busy.isLoading, refresh: busy.refetch };
}
