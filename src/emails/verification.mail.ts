import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import {TwilioService } from 'nestjs-twilio';


@Injectable()
export class SendVerificationEmail{
    constructor(private readonly mailService: MailerService){}

    async verificationMail(verificationCode: number, email: string):Promise <any>{
		const sendMail = await this.mailService.sendMail({
			from: "12012665909@mailinator.com",
			to: "12012665909@mailinator.com",
			subject: "GV3N Account Verification",
			text: "email working test",
			html: `<!DOCTYPE html>
						<html lang="en">
						
							<head>
								<meta charset="UTF-8" />
								<meta name="viewport" content="width=device-width, initial-scale=1.0" />
								<title>Email Message</title>
								<link rel="preconnect" href="https://fonts.googleapis.com" />
								<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
								<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@1000&display=swap" rel="stylesheet" />
								<link rel="preconnect" href="https://fonts.googleapis.com" />
								<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
								<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
								<link rel="preconnect" href="https://fonts.googleapis.com" />
								<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
								<link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
							</head>
							<body style="background-color: #ffffff; margin: 0; padding: 0">
								<div style="display: flex; justify-content: center">
									<div style="width: 600px; padding: 0 16px">
										<div style="
											background-color: #fbbf24;
											padding: 32px 16px;
											display: flex;
											align-items: center;
											justify-content: center;
											text-align: center;
											margin-bottom: 0;
										">
											<img src="{{asset('/image/Vector.png')}}" alt="My Data Clinic" style="height: 48px; margin-right: 24px" />
											<h1 style="
												color: #000000;
												font-size: 48px;
												font-family: 'Anton', sans-serif;
												font-weight: 1000;
												margin: 0;
												">
											GV3N
											</h1>
										</div>
						
										<div style="
												margin: 32px auto 32px auto;
												padding: 16px;
												box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
												border-radius: 8px;
												background-color: #ffffff;
											">
												<h2 style="
													text-align: center;
													font-weight: bold;
													font-size: 30px;
													font-family: 'DM Sans', sans-serif;
													margin-bottom: 16px;
													margin-top: 0; /* Adjusted top margin */
													">
												Confirm Your Email <br />
												Address
												</h2>
												<p style="
													margin-bottom: 16px;
													font-size: 13px;
													font-family: 'Inter', sans-serif;
													">
													Thank you for creating an account with us! To ensure that you
													receive important updates and notifications, we need to confirm your
													email address.
													<br /><br />
													Here is your email verification code:
													<br /><br />
													<br />
													Once you confirm your email address, you will be able to access your
													account and start using our services.
													<br /><br />
													If you did not sign up for an account with us, please disregard this
													email.
													<br /><br />
													Thank you for your prompt attention to this matter.
												</p>
												<span style="
													display: block;
													background-color: #fbbf24;
													color: #000000;
													text-align: center;
													padding: 8px 0;
													border-radius: 4px;
													margin: 0 auto;
													max-width: 200px;
													margin-bottom: 16px;
													font-weight: bold;
													font-size: 13px;
													font-family: 'DM Sans', sans-serif;
													text-decoration: none;
													">
													${verificationCode}
												</span>
											</div>
						
											<footer style="background-color: #e5e7eb; padding: 16px; text-align: center">
												<div style="
													display: flex;
													justify-content: center;
													align-items: center;
													margin-bottom: 8px;
													">
													<!-- Replace the placeholder URLs with the correct URLs for your social icons -->
													<a href="#">
														<img src="{{asset('/image/Twitter.png')}}" alt="Twitter" style="width: 32px; height: 32px; margin: 0 8px" />
													</a>
													<a href="#">
														<img src="{{asset('/image/Facebook.png')}}" alt="facebook" style="width: 32px; height: 32px; margin: 0 8px" />
													</a>
													<a href="#">
														<img src="{{asset('/image/Social Icons.png')}}" alt="Instagram" style="width: 32px; height: 32px; margin: 0 8px" />
													</a>
												</div>
												<p style="
													color: #4b5563;
													margin-bottom: 8px;
													font-weight: bold;
													color: #000000;
													font-size: 15px;
													font-family: 'DM Sans', sans-serif;
													">
												MyDataclinic.com
												</p>
												<p style="color: #4b5563; margin-bottom: 8px">
												139 ST Dover Street, Boston Massachusetts. USA
												</p>
												<!-- Replace the placeholder URL with the correct URL for your additional image -->
												<img src="{{asset('/image/Group 5.png')}}" alt="Additional Image" style="margin: 0 auto; height: 64px" />
											</footer>
										</div>
									</div>
								</body>
						
							</html>`
		});

		if(!sendMail){
			return false;
		}
		return true;
	}
}