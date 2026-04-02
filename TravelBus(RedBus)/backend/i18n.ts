export type SupportedLang = 'en' | 'hi' | 'te' | 'ta' | 'mr';

type RequestLike = {
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, unknown>;
  body?: Record<string, unknown>;
};

const SUPPORTED_LANGS: SupportedLang[] = ['en', 'hi', 'te', 'ta', 'mr'];

const MESSAGES: Record<SupportedLang, Record<string, string>> = {
  en: {
    from_to_date_required: 'From, To, and Date are required',
    date_required: 'Date is required',
    seat_lock_fields_required: 'Seat number, travel date, and UID are required',
    amount_uid_required: 'Amount and UID are required',
    uid_required: 'UID is required',
    uid_email_required: 'UID and Email are required',
    amount_required: 'Amount is required',
    payment_id_required: 'Payment ID is required',
    phone_and_message_required: 'Phone number and message are required',

    failed_search_buses: 'Failed to search buses',
    bus_not_found: 'Bus not found',
    failed_fetch_bus_details: 'Failed to fetch bus details',
    failed_fetch_seats: 'Failed to fetch seats',
    seat_already_booked: 'Seat already booked',
    seat_held_by_other: 'Seat is already held by someone else',
    seat_locked: 'Seat locked for 10 minutes',
    failed_lock_seat: 'Failed to lock seat',
    seat_unlocked: 'Seat unlocked',
    failed_unlock_seat: 'Failed to unlock seat',

    invalid_or_expired_coupon: 'Invalid or expired coupon',
    min_order_value: 'Minimum order value for this coupon is Rs {{amount}}',
    failed_validate_coupon: 'Failed to validate coupon',

    failed_initiate_booking: 'Failed to initiate booking',
    payment_verification_failed: 'Payment verification failed',
    failed_confirm_booking: 'Failed to confirm booking',
    failed_fetch_bookings: 'Failed to fetch bookings',
    booking_not_found: 'Booking not found',
    failed_fetch_booking: 'Failed to fetch booking',
    booking_already_cancelled: 'Booking is already cancelled',
    cannot_cancel_past: 'Cannot cancel past bookings',
    booking_cancelled_success: 'Booking cancelled successfully',
    failed_cancel_booking: 'Failed to cancel booking',

    failed_sync_user: 'Failed to sync user',
    user_not_found: 'User not found',
    failed_update_profile: 'Failed to update profile',

    failed_create_razorpay_order: 'Failed to create Razorpay order',
    payment_verified_successfully: 'Payment verified successfully',
    invalid_signature: 'Invalid signature',
    unauthorized_admin: 'Unauthorized. Admin access required.',
    admin_refund_reason: 'Admin initiated refund',
    failed_initiate_refund: 'Failed to initiate refund',

    invalid_webhook_signature: 'Invalid signature',
    sms_service_not_configured: 'SMS service not configured on server',
    failed_send_sms: 'Failed to send SMS',
  },
  hi: {
    from_to_date_required: 'From, To aur Date zaruri hain',
    date_required: 'Date zaruri hai',
    seat_lock_fields_required: 'Seat number, travel date aur UID zaruri hain',
    amount_uid_required: 'Amount aur UID zaruri hain',
    uid_required: 'UID zaruri hai',
    uid_email_required: 'UID aur Email zaruri hain',
    amount_required: 'Amount zaruri hai',
    payment_id_required: 'Payment ID zaruri hai',
    phone_and_message_required: 'Phone number aur message zaruri hain',

    failed_search_buses: 'Buses search karne mein dikkat aayi',
    bus_not_found: 'Bus nahi mili',
    failed_fetch_bus_details: 'Bus details lane mein dikkat aayi',
    failed_fetch_seats: 'Seats lane mein dikkat aayi',
    seat_already_booked: 'Seat pehle se booked hai',
    seat_held_by_other: 'Seat kisi aur ne hold ki hui hai',
    seat_locked: 'Seat 10 minute ke liye lock ho gayi',
    failed_lock_seat: 'Seat lock karne mein dikkat aayi',
    seat_unlocked: 'Seat unlock ho gayi',
    failed_unlock_seat: 'Seat unlock karne mein dikkat aayi',

    invalid_or_expired_coupon: 'Coupon galat hai ya expire ho chuka hai',
    min_order_value: 'Is coupon ke liye minimum order value Rs {{amount}} hai',
    failed_validate_coupon: 'Coupon validate karne mein dikkat aayi',

    failed_initiate_booking: 'Booking shuru karne mein dikkat aayi',
    payment_verification_failed: 'Payment verification fail ho gaya',
    failed_confirm_booking: 'Booking confirm karne mein dikkat aayi',
    failed_fetch_bookings: 'Bookings lane mein dikkat aayi',
    booking_not_found: 'Booking nahi mili',
    failed_fetch_booking: 'Booking details lane mein dikkat aayi',
    booking_already_cancelled: 'Booking pehle hi cancel ho chuki hai',
    cannot_cancel_past: 'Pichhli bookings cancel nahi ki ja sakti',
    booking_cancelled_success: 'Booking safalta se cancel ho gayi',
    failed_cancel_booking: 'Booking cancel karne mein dikkat aayi',

    failed_sync_user: 'User sync karne mein dikkat aayi',
    user_not_found: 'User nahi mila',
    failed_update_profile: 'Profile update karne mein dikkat aayi',

    failed_create_razorpay_order: 'Razorpay order banane mein dikkat aayi',
    payment_verified_successfully: 'Payment safalta se verify ho gaya',
    invalid_signature: 'Signature invalid hai',
    unauthorized_admin: 'Unauthorized. Sirf admin access allowed hai.',
    admin_refund_reason: 'Admin ne refund initiate kiya',
    failed_initiate_refund: 'Refund initiate karne mein dikkat aayi',

    invalid_webhook_signature: 'Signature invalid hai',
    sms_service_not_configured: 'Server par SMS service configured nahi hai',
    failed_send_sms: 'SMS bhejne mein dikkat aayi',
  },
  te: {},
  ta: {},
  mr: {},
};

for (const lang of ['te', 'ta', 'mr'] as SupportedLang[]) {
  MESSAGES[lang] = { ...MESSAGES.en, ...MESSAGES[lang] };
}

function normalizeLanguage(raw: string | undefined | null): SupportedLang {
  if (!raw) return 'en';
  const short = raw.toLowerCase().split(',')[0].trim().slice(0, 2);
  return SUPPORTED_LANGS.includes(short as SupportedLang) ? (short as SupportedLang) : 'en';
}

export function detectRequestLanguage(req: RequestLike): SupportedLang {
  const headerLang = req.headers['x-language'] || req.headers['accept-language'];
  const queryLang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
  const bodyLang = typeof req.body?.lang === 'string' ? req.body.lang : undefined;
  const bodyPreferredLang = typeof req.body?.preferredLang === 'string' ? req.body.preferredLang : undefined;

  const candidate = [
    typeof headerLang === 'string' ? headerLang : undefined,
    queryLang,
    bodyLang,
    bodyPreferredLang,
  ].find(Boolean);

  return normalizeLanguage(candidate);
}

export function t(req: RequestLike, key: string, values: Record<string, string | number> = {}): string {
  const lang = detectRequestLanguage(req);
  const template = MESSAGES[lang][key] || MESSAGES.en[key] || key;

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const value = values[token];
    return value === undefined || value === null ? '' : String(value);
  });
}
