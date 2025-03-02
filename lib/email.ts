import { Resend } from 'resend';


export const sendAdminNotification = async (notification: any) => {
  console.log(notification);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [`${process.env.CONTACT_EMAIL}`],
    subject: 'New Payment Notification',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0066cc; margin-bottom: 20px;">New Payment Notification</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong>Course:</strong> ${notification.course.title}</p>
              <p style="margin: 10px 0;"><strong>Amount:</strong> Rs. ${notification.amount}</p>
              <p style="margin: 10px 0;"><strong>User:</strong> ${notification.user.name}</p>
              <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: ${notification.status === 'completed' ? '#28a745' : '#dc3545'}">${notification.status}</span></p>
              <p style="margin: 10px 0;"><strong>Screenshot:</strong> <a href="${notification.screenshot}" style="color: #0066cc; text-decoration: none;">View Screenshot</a></p>
              <img src="${notification.screenshot}" alt="Payment Screenshot" style="max-width: 100%; margin-top: 15px; border-radius: 4px; border: 1px solid #ddd;"/>
            </div>
            <div style="text-align: center;">
              <a href="uglearn.vercel.app/admin/notifications" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Dashboard</a>
            </div>
          </div>
        </body>
      </html>
    `
  });

  console.log(data);

};