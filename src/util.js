export function truncateAddress(address) {
  if (address) {
    return (
      address.substring(0, 4) +
      "..." +
      address.substring(address.length - 4, address.length)
    );
  }
}
