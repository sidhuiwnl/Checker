import * as fs from "node:fs/promises";
import * as path from "node:path";
import Handlebars from "handlebars";
import type {NotificationType} from "../services/mail-service.ts";

interface TemplateResult {
    subject : string;
    html : string;
    text: string;
}

const templateDir = path.join(__dirname,"templates");

const templateCache = new Map<string,Handlebars.TemplateDelegate>();


async function loadTemplate(name : string) : Promise<Handlebars.TemplateDelegate>{
    if(templateCache.has(name)){
        return templateCache.get(name)!;
    }

    const templatePath = path.join(templateDir, `${name}.hbs`);
    const templateContent = fs.readFile(templatePath, "utf8");

    const template = Handlebars.compile(templateContent);

    console.log(template);

    templateCache.set(name, template);

    return template;


}

export async function renderTemplate(type :NotificationType,data : Record<string, any>) : Promise<TemplateResult>{
    const templateMapping : Record<NotificationType, string> = {
        'monitor-down': 'monitor-down',
        'monitor-up': 'monitor-up',
        'high-latency': 'high-latency',
        'monitor-created': 'monitor-created',
        'weekly-report': 'weekly-report'
    }

    const templateName = templateMapping[type];

    const template = await loadTemplate(templateName);

    const subject  = data.subject || getDefaultSubject(type,data);

    const html = template({
        ...data,
        subject
    })
    const text  = htmlToText(html);

    return {
        subject,
        html,
        text,
    }




}

function getDefaultSubject(type: NotificationType, data: Record<string, any>): string {
    const subjects: Record<NotificationType, string> = {
        'monitor-down': `🔴 Monitor Down: ${data.url || 'Your Service'}`,
        'monitor-up': `✅ Monitor Back Online: ${data.url || 'Your Service'}`,
        'high-latency': `⚠️ High Latency Detected: ${data.url || 'Your Service'}`,
        'monitor-created': 'Monitor Created Successfully',
        'weekly-report': 'Your Weekly Monitoring Report'
    };

    return subjects[type];
}

function htmlToText(html: string): string {
    // In a real implementation, use a library like html-to-text
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}