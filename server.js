require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Appointment endpoint
app.post('/api/appointment', async (req, res) => {
    try {
        const { name, phone, service, message } = req.body;

        // Validate input
        if (!name || !phone || !service) {
            return res.status(400).json({ 
                success: false, 
                message: 'Пожалуйста, заполните все обязательные поля' 
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Новая запись на процедуру',
            html: `
                <h2>Новая запись на процедуру</h2>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Услуга:</strong> ${service}</p>
                ${message ? `<p><strong>Сообщение:</strong> ${message}</p>` : ''}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send confirmation to client
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Подтверждение записи',
            html: `
                <h2>Спасибо за вашу запись!</h2>
                <p>Уважаемый(ая) ${name},</p>
                <p>Мы получили вашу заявку на процедуру ${service}.</p>
                <p>Наш администратор свяжется с вами в ближайшее время для подтверждения записи.</p>
                <br>
                <p>С уважением,</p>
                <p>Команда лазерной эпиляции</p>
            `
        };

        await transporter.sendMail(clientMailOptions);

        res.json({ 
            success: true, 
            message: 'Заявка успешно отправлена' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Произошла ошибка при отправке заявки' 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
