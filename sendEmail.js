const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.OLX_EMAIL,
        pass: process.env.OLX_EMAIL_PASS
    }
});

async function sendEmail(newAdverts) {
    if (!newAdverts.length) return;

    const html = newAdverts.map(ad => `
        <div>
            <b>${ad.title}</b><br>
            ${ad.address}<br>
            Cena: ${ad.cost} zł, Metraż: ${ad.size} m²<br>
            Godzina: ${ad.date}<br>
            <a href="${ad.link}">${ad.link}</a>
            ${ad.isPromoted ? '<span style="color: red;">(Promowane)</span>' : ''}
        </div>
        <hr>
    `).join('');

    await transporter.sendMail({
        from: `OLX Scraper <${process.env.OLX_EMAIL}>`,
        to: process.env.MAIL_RECEIVER,
        subject: 'Nowe ogłoszenia OLX',
        html
    });
}
exports.sendEmail = sendEmail;
