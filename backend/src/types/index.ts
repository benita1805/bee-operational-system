export interface User {
    id: string;
    phone: string;
}

export interface JWTPayload {
    userId: string;
    phone: string;
}

export interface Hive {
    id: string;
    user_id: string;
    title: string;
    farmer_name: string | null;
    field_location: string | null;
    placement_date: string | null;
    expected_harvest_date: string | null;
    status: 'ACTIVE' | 'HARVESTED' | 'RELOCATED';
    notes: string | null;
    media_urls: string[];
    last_synced_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Farmer {
    id: string;
    name: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    crops: string[];
    created_at: string;
    updated_at: string;
}

export interface SyncPayload {
    hives: Partial<Hive>[];
    last_synced_at: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
