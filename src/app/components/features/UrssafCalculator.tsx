import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Calendar, Euro, Calculator, AlertCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const URSSAFCalculator = () => {
    const [revenue, setRevenue] = useState('');
    const [history, setHistory] = useState([]);
    const [includeImpot, setIncludeImpot] = useState(true);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const URSSAF_RATE = 0.231;
    const IMPOT_RATE = 0.022;
    const FORMATION_RATE = 0.002;

    const getQuarter = (date) => {
        const month = date.getMonth();
        if (month < 3) return 1;
        if (month < 6) return 2;
        if (month < 9) return 3;
        return 4;
    };

    const getCurrentQuarter = () => {
        return getQuarter(new Date());
    };

    const getNextDeadline = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const deadlines = [
            new Date(currentYear, 0, 31),
            new Date(currentYear, 3, 30),
            new Date(currentYear, 6, 31),
            new Date(currentYear, 9, 31),
        ];

        for (let deadline of deadlines) {
            if (deadline > now) return deadline;
        }
        return new Date(currentYear + 1, 0, 31);
    };

    const calculateURSSAF = () => {
        if (!revenue) return;

        const revenueNum = parseFloat(revenue);
        const urssafAmount = revenueNum * URSSAF_RATE;
        const impotAmount = includeImpot ? revenueNum * IMPOT_RATE : 0;
        const formationAmount = revenueNum * FORMATION_RATE;
        const totalAmount = urssafAmount + impotAmount + formationAmount;

        const newEntry = {
            id: Date.now(),
            date: new Date(),
            quarter: getCurrentQuarter(),
            revenue: revenueNum,
            urssafAmount,
            impotAmount,
            formationAmount,
            totalAmount
        };

        setHistory([newEntry, ...history]);
        setRevenue('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const deleteEntry = (id) => {
        setHistory(history.filter(entry => entry.id !== id));
        setEntryToDelete(null);
    };

    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
    };

    const getQuarterSummary = (quarter) => {
        const quarterEntries = history.filter(entry => entry.quarter === quarter);
        return {
            totalRevenue: quarterEntries.reduce((sum, entry) => sum + entry.revenue, 0),
            totalUrssaf: quarterEntries.reduce((sum, entry) => sum + entry.urssafAmount, 0),
            totalImpot: quarterEntries.reduce((sum, entry) => sum + entry.impotAmount, 0),
            totalFormation: quarterEntries.reduce((sum, entry) => sum + entry.formationAmount, 0),
            totalAmount: quarterEntries.reduce((sum, entry) => sum + entry.totalAmount, 0),
            entries: quarterEntries
        };
    };

    const QuarterSummary = ({ quarter }) => {
        const summary = getQuarterSummary(quarter);
        if (summary.entries.length === 0) return null;

        return (
            <Card className="mt-4 border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                            <Calendar className="h-5 w-5" />
                            <span>Trimestre {quarter}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-sm text-gray-500">Chiffre d'affaires</div>
                                <div className="text-lg font-medium">{summary.totalRevenue.toLocaleString()}€</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">URSSAF (23.1%)</div>
                                <div className="text-lg font-medium">{summary.totalUrssaf.toLocaleString()}€</div>
                            </div>
                            {summary.totalImpot > 0 && (
                                <div>
                                    <div className="text-sm text-gray-500">Impôt (2.2%)</div>
                                    <div className="text-lg font-medium">{summary.totalImpot.toLocaleString()}€</div>
                                </div>
                            )}
                            <div>
                                <div className="text-sm text-gray-500">Formation (0.2%)</div>
                                <div className="text-lg font-medium">{summary.totalFormation.toLocaleString()}€</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium text-blue-700">Total à payer</span>
                            <span className="text-xl font-bold text-blue-700">{summary.totalAmount.toLocaleString()}€</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const nextDeadline = getNextDeadline();
    const daysUntilDeadline = Math.ceil((nextDeadline - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="max-w-xl mx-auto p-4">
            <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette entrée ?
                            Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => entryToDelete && deleteEntry(entryToDelete.id)}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Calculator className="h-6 w-6" />
                        <CardTitle>Calculateur URSSAF</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Alert className={`mb-6 ${daysUntilDeadline <= 7 ? 'border-red-500 bg-red-50' : 'border-blue-200'}`}>
                        <AlertCircle className={`h-4 w-4 ${daysUntilDeadline <= 7 ? 'text-red-500' : 'text-blue-500'}`} />
                        <AlertTitle className="flex items-center gap-2">
                            Prochaine échéance
                        </AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                            <span>{nextDeadline.toLocaleDateString()}</span>
                            <span className={`text-sm font-medium ${daysUntilDeadline <= 7 ? 'text-red-500' : 'text-blue-500'}`}>
                {daysUntilDeadline} jours restants
              </span>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Switch
                                id="impot"
                                checked={includeImpot}
                                onCheckedChange={setIncludeImpot}
                            />
                            <Label htmlFor="impot" className="text-sm font-medium">
                                Inclure le versement libératoire d'impôt (2.2%)
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="revenue" className="text-sm font-medium">
                                Revenu (€)
                            </Label>
                            <div className="relative">
                                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="revenue"
                                    type="number"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    placeholder="Entrez votre revenu"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={calculateURSSAF}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!revenue}
                        >
                            <Calculator className="h-4 w-4 mr-2" />
                            Calculer
                        </Button>

                        {showSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <AlertDescription className="text-green-600">
                                    Calcul effectué avec succès !
                                </AlertDescription>
                            </Alert>
                        )}

                        {history.length > 0 && (
                            <div className="mt-6">
                                <Tabs defaultValue="summary" className="w-full">
                                    <TabsList className="w-full bg-gray-100 p-1">
                                        <TabsTrigger value="summary" className="flex-1 data-[state=active]:bg-white">
                                            Résumé Trimestriel
                                        </TabsTrigger>
                                        <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white">
                                            Historique
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="summary">
                                        {[1, 2, 3, 4].map(quarter => (
                                            <QuarterSummary key={quarter} quarter={quarter} />
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="history">
                                        <div className="space-y-3">
                                            {history.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="p-4 bg-white border border-gray-200 rounded-lg relative group hover:shadow-md transition-shadow"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleDeleteClick(entry)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{entry.date.toLocaleDateString()}</span>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              T{entry.quarter}
                            </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="text-sm text-gray-500">Revenu</div>
                                                            <div className="font-medium">{entry.revenue.toLocaleString()}€</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500">URSSAF</div>
                                                            <div className="font-medium">{entry.urssafAmount.toLocaleString()}€</div>
                                                        </div>
                                                        {entry.impotAmount > 0 && (
                                                            <div>
                                                                <div className="text-sm text-gray-500">Impôt</div>
                                                                <div className="font-medium">{entry.impotAmount.toLocaleString()}€</div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm text-gray-500">Formation</div>
                                                            <div className="font-medium">{entry.formationAmount.toLocaleString()}€</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-600">Total</span>
                                                        <span className="text-lg font-bold text-blue-600">{entry.totalAmount.toLocaleString()}€</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default URSSAFCalculator;