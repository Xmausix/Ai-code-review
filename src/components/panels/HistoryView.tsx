
"use client";
import type { FC } from 'react';
import type { Revision } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, RotateCcw, Info } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface HistoryViewProps {
    revisions: Revision[];
    onLoadRevision: (revision: Revision) => void;
    onClearHistory: () => void;
}

const HistoryView: FC<HistoryViewProps> = ({ revisions, onLoadRevision, onClearHistory }) => {
    if (revisions.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                <Info className="mx-auto h-12 w-12 mb-4 text-primary" />
                <p className="text-lg font-medium">No history yet.</p>
                <p className="text-sm">Your code reviews and explanations will appear here.</p>
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-2">
                <div className="flex-grow">
                    <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-medium">Revision History</CardTitle>
                    </div>
                    <CardDescription className="text-xs pt-1 pl-8">Review your past code analyses.</CardDescription>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={revisions.length === 0} className="text-xs px-2 shrink-0">
                            <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" /> Clear All
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will permanently delete all your revision history. This cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onClearHistory}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] md:h-[400px] pr-1"> {/* Dynamic height example */}
                    <ul className="space-y-2">
                        {revisions.map((revision) => (
                            <li key={revision.id} className="p-2.5 border rounded-md hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div className="flex-grow overflow-hidden">
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      {new Date(revision.timestamp).toLocaleString()}
                    </span>
                                        <p className="font-mono text-xs truncate">
                                            {revision.code.split('\\n')[0] || revision.code.substring(0, 40)}...
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-start sm:self-center">
                                        <Badge variant="outline" className="capitalize text-xs px-1.5 py-0.5">{revision.language}</Badge>
                                        <Badge variant={revision.type === 'review' ? 'secondary' : 'default'} className="capitalize text-xs px-1.5 py-0.5">{revision.type}</Badge>
                                        <Button variant="ghost" size="sm" onClick={() => onLoadRevision(revision)} className="text-xs px-2">
                                            <RotateCcw className="mr-1 h-3 w-3" /> Load
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default HistoryView;
