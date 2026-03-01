require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must utilize Service Role Key for bypassing RLS if needed, or stick to public flow.
// However, the schema has RLS. The service role key bypasses RLS policies.
// If the user hasn't provided SERVICE_ROLE_KEY in .env, we might fail or should fall back to ANON if policies allow.
// .env usually has SERVICE_ROLE_KEY.

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDB() {
    console.log('=== Database Seeding ===');

    // 1. Seed User
    const phoneNumber = '+1234567890';
    console.log(`Seeding User (${phoneNumber})...`);

    // Check if user exists to avoid duplicates
    const { data: existingUser } = await supabase.from('users').select('id').eq('phone_number', phoneNumber).single();

    let userId;

    if (existingUser) {
        console.log('User already exists, updating...');
        const { data, error } = await supabase
            .from('users')
            .update({ is_verified: true, otp: null, otp_expires_at: null })
            .eq('id', existingUser.id)
            .select()
            .single();
        if (error) throw new Error(`Failed to update user: ${error.message}`);
        userId = data.id;
    } else {
        const { data, error } = await supabase
            .from('users')
            .insert({
                phone_number: phoneNumber,
                is_verified: true,
                otp: null,
                otp_expires_at: null
            })
            .select()
            .single();
        if (error) throw new Error(`Failed to create user: ${error.message}`);
        userId = data.id;
    }
    console.log(`✓ User setup complete (ID: ${userId})`);

    // 2. Seed Farmer
    console.log('Seeding Farmer...');
    const farmerData = {
        name: "John Doe",
        location: "Seed Location",
        latitude: 36.7783,
        longitude: -119.4179,
        crops: ["Almonds", "Cherries"]
    };

    const { error: farmerError } = await supabase.from('farmers').insert(farmerData);
    // Ignore duplicate error if unique constraint wasn't set but we want to be safe. 
    // Schema doesn't enforce unique farmer name, so this will duplicate if run multiple times.
    // Let's delete generic one first to be clean.
    await supabase.from('farmers').delete().eq('name', 'John Doe');
    await supabase.from('farmers').insert(farmerData);

    console.log('✓ Farmer seeded');

    // 3. Seed Hive
    console.log('Seeding Hive...');
    // Clean up old seeded hives for this user
    await supabase.from('hives').delete().eq('user_id', userId).eq('title', 'Seed Hive Alpha');

    const hiveData = {
        user_id: userId,
        title: "Seed Hive Alpha",
        status: "ACTIVE",
        placement_date: new Date().toISOString(),
        notes: "Automatically seeded hive"
    };

    const { error: hiveError } = await supabase.from('hives').insert(hiveData);
    if (hiveError) throw new Error(`Failed to seed hive: ${hiveError.message}`);

    console.log('✓ Hive seeded');

    console.log('=== Seeding Complete ===');
}

seedDB().catch(err => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
});
