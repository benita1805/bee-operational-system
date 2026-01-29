import { FloweringDB } from "../data/indiaFloweringData";
import { daysRemaining } from "../utils/date";

export function computeHiveRiskScore(hive, region = "TN", month = "Jan") {
    let score = 0;

    const d = daysRemaining(hive.harvestDate);
    if (d === null) score += 10;
    else if (d < 0) score += 30;
    else if (d <= 7) score += 20;
    else if (d <= 21) score += 10;

    if (hive.status !== "Active") score += 5;

    const cropList = FloweringDB[region] || [];
    const bestNow = cropList.find((c) => c.flowering.includes(month));
    if (!bestNow) score += 15;

    const notes = (hive.notes || "").toLowerCase();
    if (notes.includes("pest") || notes.includes("mite") || notes.includes("weak")) score += 20;
    if (notes.includes("queen missing") || notes.includes("no brood")) score += 30;

    return Math.min(score, 100);
}

export function getRiskLabel(score) {
    if (score >= 70) return { label: "High Risk", color: "danger" };
    if (score >= 40) return { label: "Moderate Risk", color: "amber" };
    return { label: "Low Risk", color: "success" };
}

export function generateRecommendations(hive, region = "TN", month = "Jan") {
    const rec = [];
    const d = daysRemaining(hive.harvestDate);

    if (d !== null && d >= 0 && d <= 7) {
        rec.push("Harvest is due soon. Prepare extraction equipment and inspect hive twice this week.");
    }
    if (d !== null && d < 0) {
        rec.push("Harvest date is overdue. Update harvest date or mark hive as Harvested.");
    }

    const cropList = FloweringDB[region] || [];
    const flowNow = cropList.filter((c) => c.flowering.includes(month));

    if (flowNow.length > 0) {
        rec.push(`Current nectar flow crops: ${flowNow.map((c) => c.crop).join(", ")}. Consider placing hives near these areas.`);
    } else {
        rec.push("Low flowering month detected. Consider relocation or feeding support to maintain colony strength.");
    }

    const notes = (hive.notes || "").toLowerCase();
    if (notes.includes("pest") || notes.includes("mite")) rec.push("Pest warning. Inspect mites/ants and maintain hive hygiene.");
    if (notes.includes("weak")) rec.push("Colony seems weak. Check queen presence, brood and provide feeding if required.");

    rec.push("Weekly checklist: inspect entrance activity, check water availability, and ensure hive ventilation.");

    return rec;
}
