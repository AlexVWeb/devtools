"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Copy, Calendar, Clock, AlertCircle } from 'lucide-react';

interface CronExpression {
    minutes: string;
    hours: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
}

interface MonthOption {
    value: string;
    label: string;
}

interface DayOption {
    value: string;
    label: string;
}

const CronGenerator = () => {
    const [cronExpression, setCronExpression] = useState<CronExpression>({
        minutes: '*',
        hours: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
    });
    const [copied, setCopied] = useState(false);

    const months: MonthOption[] = [
        { value: '*', label: 'Tous les mois' },
        { value: '1', label: 'Janvier' },
        { value: '2', label: 'Février' },
        { value: '3', label: 'Mars' },
        { value: '4', label: 'Avril' },
        { value: '5', label: 'Mai' },
        { value: '6', label: 'Juin' },
        { value: '7', label: 'Juillet' },
        { value: '8', label: 'Août' },
        { value: '9', label: 'Septembre' },
        { value: '10', label: 'Octobre' },
        { value: '11', label: 'Novembre' },
        { value: '12', label: 'Décembre' }
    ];

    const daysOfWeek: DayOption[] = [
        { value: '*', label: 'Tous les jours' },
        { value: '1', label: 'Lundi' },
        { value: '2', label: 'Mardi' },
        { value: '3', label: 'Mercredi' },
        { value: '4', label: 'Jeudi' },
        { value: '5', label: 'Vendredi' },
        { value: '6', label: 'Samedi' },
        { value: '0', label: 'Dimanche' }
    ];

    const handleChange = (field: keyof CronExpression, value: string) => {
        setCronExpression(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getFullCronExpression = () => {
        return `${cronExpression.minutes} ${cronExpression.hours} ${cronExpression.dayOfMonth} ${cronExpression.month} ${cronExpression.dayOfWeek}`;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getFullCronExpression());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getHumanReadableExpression = () => {
        let description = 'Exécution ';

        if (cronExpression.minutes === '*' && cronExpression.hours === '*') {
            description += 'toutes les minutes';
        } else if (cronExpression.minutes === '0') {
            description += `à ${cronExpression.hours}h00`;
        } else {
            description += `à ${cronExpression.hours}h${cronExpression.minutes}`;
        }

        if (cronExpression.dayOfMonth !== '*') {
            description += ` le ${cronExpression.dayOfMonth}`;
        }

        if (cronExpression.month !== '*') {
            description += ` en ${months.find(m => m.value === cronExpression.month)?.label}`;
        }

        if (cronExpression.dayOfWeek !== '*') {
            description += ` le ${daysOfWeek.find(d => d.value === cronExpression.dayOfWeek)?.label}`;
        }

        return description;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Générateur d&apos;Expression CRON
            </h3>

            <Card className="bg-gray-50 dark:bg-gray-900 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="h-6 w-6" />
                        <CardTitle>Configuration de l&apos;Expression CRON</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {/* Minutes et Heures */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Minutes</Label>
                                <Input
                                    type="text"
                                    value={cronExpression.minutes}
                                    onChange={(e) => handleChange('minutes', e.target.value)}
                                    placeholder="* ou 0-59"
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Heures</Label>
                                <Input
                                    type="text"
                                    value={cronExpression.hours}
                                    onChange={(e) => handleChange('hours', e.target.value)}
                                    placeholder="* ou 0-23"
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        {/* Jour du mois */}
                        <div className="space-y-2">
                            <Label>Jour du mois</Label>
                            <Input
                                type="text"
                                value={cronExpression.dayOfMonth}
                                onChange={(e) => handleChange('dayOfMonth', e.target.value)}
                                placeholder="* ou 1-31"
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>

                        {/* Mois */}
                        <div className="space-y-2">
                            <Label>Mois</Label>
                            <Select value={cronExpression.month} onValueChange={(value: string) => handleChange('month', value)}>
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue placeholder="Sélectionnez un mois" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Jour de la semaine */}
                        <div className="space-y-2">
                            <Label>Jour de la semaine</Label>
                            <Select value={cronExpression.dayOfWeek} onValueChange={(value: string) => handleChange('dayOfWeek', value)}>
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue placeholder="Sélectionnez un jour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {daysOfWeek.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Expression CRON générée */}
                        <div className="space-y-2">
                            <Label>Expression CRON</Label>
                            <div className="relative group">
                                <Input
                                    type="text"
                                    value={getFullCronExpression()}
                                    readOnly
                                    className="pr-24 dark:bg-gray-800 dark:border-gray-700"
                                />
                                <Button
                                    onClick={handleCopy}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    {copied ? 'Copié !' : 'Copier'}
                                </Button>
                            </div>
                        </div>

                        {/* Description en langage naturel */}
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <AlertTitle>Description</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                {getHumanReadableExpression()}
                            </AlertDescription>
                        </Alert>

                        {/* Info Card */}
                        <Alert className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <AlertTitle>Note</AlertTitle>
                            <AlertDescription className="text-gray-600 dark:text-gray-300">
                                Utilisez * pour &quot;tous&quot; ou entrez des valeurs spécifiques. Les expressions CRON suivent le format : minutes heures jour_du_mois mois jour_de_la_semaine
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CronGenerator; 