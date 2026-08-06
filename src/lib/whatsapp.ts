export interface OrderPayload {
  intent: string;
  itemName: string;
  metaDetails?: string; 
}

export function generateKunaljLink(intent: string, itemName: string, metaDetails: string = ""): string {
  const primaryNumber = "2348038587752";
  const detailsString = metaDetails ? ` Details: ${metaDetails}.` : '';
  const message = `Hello KUNLAJ Autos, I am inquiring about [${intent}: ${itemName}].${detailsString} Please confirm availability.`;
  return `https://wa.me/${primaryNumber}?text=${encodeURIComponent(message)}`;
}
