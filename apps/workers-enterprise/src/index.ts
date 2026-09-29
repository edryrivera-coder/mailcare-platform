// ============================================================================
// ENTERPRISE VERIFICATION WORKER POOL (Sec. 13-19, NFA-08, NFA-11, NFA-28..30)
// ============================================================================

export const PARTITION_CHUNK_SIZE = 10_000; // NFA-08: 1,000,000 records -> 100 partitions of 10,000

export function partitionEnterpriseBatch(totalRecords: number): Array<{ partitionIndex: number; startRow: number; endRow: number }> {
  const partitions: Array<{ partitionIndex: number; startRow: number; endRow: number }> = [];
  let current = 1;
  let index = 0;

  while (current <= totalRecords) {
    const end = Math.min(totalRecords, current + PARTITION_CHUNK_SIZE - 1);
    partitions.push({
      partitionIndex: index,
      startRow: current,
      endRow: end,
    });
    current = end + 1;
    index += 1;
  }
  return partitions;
}
