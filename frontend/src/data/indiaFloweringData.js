// India-focused flowering + nectar flow planning dataset
// NOTE: This is a demo dataset designed for Tamil Nadu + Kerala + Karnataka + Andhra.
// You can add more states/crops later.

export const INDIA_REGIONS = [
    { id: "TN", name: "Tamil Nadu" },
    { id: "KL", name: "Kerala" },
    { id: "KA", name: "Karnataka" },
    { id: "AP", name: "Andhra Pradesh" },
];

export const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Yield indicators
export const Yield = {
    HIGH: "High",
    MED: "Medium",
    LOW: "Low",
};

export const FloweringDB = {
    TN: [
        {
            crop: "Sunflower",
            flowering: ["Feb", "Mar"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Shift hives 1–2 weeks before bloom starts.",
            notes: "Strong nectar flow in southern districts. Avoid pesticide spray periods.",
        },
        {
            crop: "Coconut",
            flowering: ["Jan", "Feb", "Mar", "Apr", "May"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Good long-duration nectar source. Maintain hive ventilation.",
            notes: "Works well as a baseline nectar source through summer.",
        },
        {
            crop: "Banana",
            flowering: ["Mar", "Apr", "May"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Useful for pollen support; combine with other nectar crops.",
            notes: "Keep water source nearby; heat management required.",
        },
        {
            crop: "Neem",
            flowering: ["Apr", "May"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Place hives close; nectar flow is seasonal and short.",
            notes: "Good for strengthening colony before summer peak.",
        },
    ],

    KL: [
        {
            crop: "Coconut",
            flowering: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Stable nectar. Protect hives from high rainfall.",
            notes: "Monsoon moisture can trigger fungal issues; hive stand elevation important.",
        },
        {
            crop: "Rubber",
            flowering: ["Jan", "Feb", "Mar"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Ideal early-year flow. Shift hives late Dec.",
            notes: "One of Kerala’s best honey flows; avoid disturbance during peak days.",
        },
        {
            crop: "Coffee",
            flowering: ["Feb", "Mar"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Strong yield; place hives at plantation edges.",
            notes: "Wayanad / high ranges are strong nectar zones.",
        },
    ],

    KA: [
        {
            crop: "Coffee",
            flowering: ["Feb", "Mar"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Major flow season. Shift in Jan end.",
            notes: "Kodagu region strong yields; cool climate helps.",
        },
        {
            crop: "Eucalyptus",
            flowering: ["Oct", "Nov", "Dec", "Jan"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Long-duration flow. Good for commercial yield.",
            notes: "Strong nectar but can crystallize fast; monitor extraction timing.",
        },
        {
            crop: "Sunflower",
            flowering: ["Jan", "Feb"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Best for early-year placement + colony buildup.",
            notes: "Pesticide coordination needed.",
        },
    ],

    AP: [
        {
            crop: "Mango",
            flowering: ["Jan", "Feb"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Short bloom; place hives early.",
            notes: "Good for early season colony strength.",
        },
        {
            crop: "Sunflower",
            flowering: ["Dec", "Jan", "Feb"],
            nectarFlow: Yield.HIGH,
            yieldPotential: Yield.HIGH,
            placementAdvice: "Shift hives before Dec end.",
            notes: "Major nectar flow regions. Avoid pesticide spray windows.",
        },
        {
            crop: "Cotton",
            flowering: ["Jul", "Aug", "Sep"],
            nectarFlow: Yield.MED,
            yieldPotential: Yield.MED,
            placementAdvice: "Good flow but pesticide risk is high.",
            notes: "Ensure farmers follow safe spray timings.",
        },
    ],
};
