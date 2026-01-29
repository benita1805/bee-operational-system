export const manualSections = [
    // ===========================
    // BUZZ-OFF SYSTEM MANUAL
    // ===========================
    {
        id: "BO-1",
        title: "Buzz-Off System Overview",
        content:
            "Buzz-Off is an AI-based hornet detection and hive protection system. It monitors the hive entrance using an ESP32-CAM and detects hornets in real time. When hornets are detected, the system activates a repelling buzzer and sends alerts to the beekeeper through the application/SMS. The goal is to protect colonies, improve survival rate, and increase honey yield.",
    },
    {
        id: "BO-2",
        title: "Hardware Components Used",
        content:
            "1) ESP32-CAM for monitoring hive entrance.\n2) AI hornet detection model.\n3) High-frequency repelling buzzer/ultrasonic unit.\n4) GSM module (SIM800L) for SMS alerts (optional if internet available).\n5) Power system: battery + optional solar panel.\n6) Weatherproof enclosure + mounting stand.\n7) Switch/indicator LEDs for status monitoring.",
    },
    {
        id: "BO-3",
        title: "Installation Guidelines (Camera & Buzzer Placement)",
        content:
            "Step 1: Fix the ESP32-CAM facing hive entrance.\n- Distance: 10–25 cm from entrance.\n- Angle: capture full entrance area.\n- Avoid direct sunlight glare.\n\nStep 2: Fix buzzer near entrance.\n- Keep buzzer inside enclosure with a sound outlet.\n- Ensure sound reaches entrance.\n\nStep 3: Weatherproofing.\n- Seal openings.\n- Keep electronics away from rain and moisture.",
    },
    {
        id: "BO-4",
        title: "Power Setup & Connectivity",
        content:
            "Power Options:\n- Rechargeable battery (recommended).\n- Battery + solar charging for long-term use.\n\nConnectivity:\n- GSM Mode: insert SIM, ensure network signal.\n- Wi-Fi Mode: connect device to hotspot/router.\n\nTip: Always test power and network before final installation at the apiary.",
    },
    {
        id: "BO-5",
        title: "How Hornet Detection Works",
        content:
            "The camera continuously monitors the entrance. The AI model identifies hornet-like features and movement patterns. If hornet probability crosses the threshold:\n1) Buzzer turns ON instantly.\n2) Alert is created with time and location.\n3) The alert is sent to the beekeeper.\n\nThis reduces hornet hovering and attacks near entrance, protecting bees during peak nectar flow.",
    },
    {
        id: "BO-6",
        title: "App Usage (Dashboard + Alerts)",
        content:
            "In the Buzz-Off app you can:\n- See device status (Online/Offline).\n- View last hornet detection time.\n- View hornet detection count.\n- View history logs (date/time).\n- Enable/disable buzzer manually.\n\nRecommended: Keep notifications enabled to receive immediate alerts.",
    },
    {
        id: "BO-7",
        title: "Manual Override & Emergency Control",
        content:
            "Manual Control:\n- Buzzer ON: Use during frequent hornet attacks or high-risk flowering season.\n- Buzzer OFF: Use while inspecting hive, feeding, or maintenance.\n\nEmergency Tip:\nIf hornet attacks increase rapidly, relocate hives temporarily and keep buzzer ON during daytime.",
    },
    {
        id: "BO-8",
        title: "Safety Precautions (Electronics + Bees)",
        content:
            "Electronics Safety:\n- Keep unit dry.\n- Power OFF before opening enclosure.\n- Do not touch wiring with wet hands.\n\nBee Safety:\n- Do not keep buzzer ON continuously for long durations unless required.\n- Use calm inspection methods (minimal disturbance).\n\nHuman Safety:\n- Avoid exposing ears to buzzer at close range.",
    },
    {
        id: "BO-9",
        title: "Troubleshooting Guide",
        content:
            "Problem: Device Offline\n- Cause: Battery drained / weak Wi-Fi\n- Fix: Recharge battery / move hotspot closer\n\nProblem: No Alerts\n- Cause: SIM/network issue / notifications disabled\n- Fix: Check SIM signal or enable notifications\n\nProblem: Buzzer not working\n- Cause: Loose connection\n- Fix: Recheck wiring and buzzer module\n\nProblem: False detection\n- Cause: sudden lighting changes\n- Fix: adjust camera angle, add shade cover",
    },

    // ===========================
    // TRADITIONAL HIVE MANAGEMENT
    // ===========================
    {
        id: "TR-1",
        title: "Hive Placement Guidelines",
        content:
            "Good placement improves colony strength and honey yield.\n\nBest Practices:\n- Keep hive near flowering plants and a clean water source.\n- Provide morning sunlight, avoid harsh afternoon heat.\n- Keep hive elevated 1–2 feet above ground.\n- Avoid damp, windy, and pesticide-heavy areas.\n\nTip: In pollination placement near farms, coordinate with farmers about pesticide spray timings.",
    },
    {
        id: "TR-2",
        title: "Hive Maintenance Procedures",
        content:
            "Weekly Checks:\n- Hive entrance activity\n- Pests (ants, wax moth, mites)\n- Brood pattern and queen health\n\nMonthly Checks:\n- Comb condition and spacing\n- Hive cleanliness\n- Repair cracks and gaps\n\nAvoid opening hive frequently (stress bees and reduces productivity).",
    },
    {
        id: "TR-3",
        title: "Honey Collection & Extraction Steps",
        content:
            "Harvest honey only when cells are capped.\n\nSteps:\n1) Use smoker lightly.\n2) Remove frames carefully.\n3) Brush bees gently.\n4) Uncap wax layer.\n5) Extract using honey extractor or crush-and-strain.\n6) Filter honey.\n7) Store in airtight dry containers.\n\nAvoid harvesting too early — it reduces honey quality.",
    },
    {
        id: "TR-4",
        title: "Safety Precautions While Handling Bees",
        content:
            "Wear safety gear:\n- Bee suit\n- Gloves\n- Veil\n\nPrecautions:\n- Work calmly and slowly.\n- Avoid strong perfumes.\n- Use minimal smoke.\n- Keep first-aid ready for stings.\n\nNever disturb hive during heavy rain or late evening.",
    },
    {
        id: "TR-5",
        title: "Do’s and Don’ts for Beekeeping",
        content:
            "✅ Do:\n- Keep water near hive.\n- Inspect hive every 7–10 days.\n- Provide shade in summer.\n- Maintain clean surroundings.\n\n❌ Don’t:\n- Open hive daily.\n- Harvest during shortage season.\n- Keep hive near pesticides.\n- Use chemicals inside hive unnecessarily.",
    },
    {
        id: "TR-6",
        title: "Basic Disease Prevention",
        content:
            "Common warning signs:\n- reduced bee activity\n- dead larvae\n- foul smell from hive\n- irregular brood pattern\n\nPrevention:\n- Keep hive dry.\n- Disinfect tools.\n- Replace old comb periodically.\n- Avoid overcrowding.\n\nIf disease spreads, isolate hive and consult local apiculture expert.",
    },
    {
        id: "TR-7",
        title: "Seasonal Hive Management Tips",
        content:
            "Summer:\n- Provide shade + water\n- Ensure ventilation\n\nMonsoon:\n- Protect from moisture\n- Prevent fungal growth\n\nWinter:\n- Reduce entrance size\n- Protect from cold wind\n\nFlowering Season:\n- Shift hives near nectar-rich crops\n- Activate Buzz-Off hornet protection during peak hornet activity",
    },
];
