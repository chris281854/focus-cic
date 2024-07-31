import dayjs from "dayjs"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const getStatus = (eventDate) => {
  const today = dayjs()
  const date = dayjs(eventDate)

  const nearThreshold = 2
  const farThreshold = 5

  const differenceInDays = date.diff(today, "day")

  if (differenceInDays < 0) {
    return "0" //Retrasado
  } else if (differenceInDays >= nearThreshold) {
    return "1" //inmediato
  } else if (differenceInDays <= farThreshold) {
    return "2" //cerca
  } else {
    return "3" //lejos
  }
}
