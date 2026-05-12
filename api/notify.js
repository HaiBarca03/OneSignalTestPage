const fetch = require('node-fetch');

export default async function handler(req, res) {
    // Chỉ cho phép phương thức POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { YOUR_REST_API_KEY, ...notificationData } = req.body;

    // Lấy Key từ Environment Variable trên Vercel
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!restApiKey) {
        return res.status(500).json({
            success: false,
            message: 'Chưa cấu hình ONESIGNAL_REST_API_KEY trên Vercel. Vui lòng vào Settings -> Environment Variables để thêm.'
        });
    }

    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${restApiKey}`
            },
            body: JSON.stringify(notificationData)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
