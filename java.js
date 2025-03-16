const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/new-post", async (req, res) => {
    const { title, content } = req.body;
    const subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

    if (subscribers.length === 0) {
        return res.status(200).json({ message: "No subscribers to notify." });
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-email-password",
        },
    });

    let mailOptions = {
        from: "your-email@gmail.com",
        to: subscribers.join(","),
        subject: `New Post: ${title}`,
        text: `A new post has been published!\n\nTitle: ${title}\n\n${content}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Emails sent!" });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ message: "Error sending emails." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));