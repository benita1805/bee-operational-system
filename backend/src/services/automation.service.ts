export const evaluateHiveState = (hive: { expected_harvest_date: string | Date }) => {
    const today = new Date();
    if (new Date(hive.expected_harvest_date) < today) {
        return 'READY_FOR_HARVEST';
    }
    return 'ACTIVE';
};
