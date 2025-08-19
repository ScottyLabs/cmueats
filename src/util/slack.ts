import axios from 'axios';
import env from '../env';

export default async function notifySlack(message: string) {
    await axios.post(
        `${env.VITE_API_URL}/api/sendSlackMessage`, // we can't directly call the Slack webhook because they don't support CORS preflight checking https://github.com/slackapi/node-slack-sdk/issues/1568
        { message: `${message}\nBrowser info: \`${navigator.userAgent}\`` },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
}
