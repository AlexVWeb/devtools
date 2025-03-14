import {Code2, Database, FileCode, GitBranch, LayoutGrid, Link} from "lucide-react";
import React from "react";
import JiraToGit from "@/app/components/features/JiraToGit";
import UrlTransformer from "@/app/components/features/UrlTransformer";
import TextTransform from "@/app/components/features/TextTransform";
import ReportFormatter from "@/app/components/features/ReportFormatter";
import URSSAFCalculator from "@/app/components/features/UrssafCalculator";
import SiretGenerator from "@/app/components/features/SiretGenerator";
import Base64 from "@/app/components/features/Base64";
import JWTDecoder from "@/app/components/features/JWTDecoder";
import ColorConverter from "@/app/components/features/ColorConverter";
import CronGenerator from "@/app/components/features/CronGenerator";
import RegExTester from "@/app/components/features/RegExTester";

export interface MenuItem {
    name: string;
    description: string;
    component?: React.JSX.Element;
    new?: boolean;
}

export interface MenuItems {
    [key: string]: {
        icon: JSX.Element;
        items: MenuItem[];
    };
}

export const menuItems: MenuItems = {
    'Workflow Tools': {
        icon: <GitBranch className="w-5 h-5"/>,
        items: [
            {name: 'Jira to Git', description: 'Convert Jira tickets to Git branches', component: <JiraToGit/>, new: true},
            {name: 'PR Template', description: 'Generate pull request templates'},
            {name: 'Commit Message', description: 'Format commit messages'},
            {name: 'Scrum Helper', description: 'Tools for agile ceremonies'},
            {name: 'URSSAF Calculateur', description: 'Calculateur URSSAF', component: <URSSAFCalculator/>, new: true},
            {name: 'Siret Générateur', description: 'Siret Générateur', component: <SiretGenerator/>, new: true}
        ]
    },
    'Code Tools': {
        icon: <FileCode className="w-5 h-5"/>,
        items: [
            {name: 'String Transformer', description: 'Transform text strings', component: <TextTransform/>, new: true},
            {name: 'JSON Formatter', description: 'Format and validate JSON'},
            {name: 'Code Generator', description: 'Generate code templates'},
            {name: 'RegEx Tester', description: 'Test regular expressions', component: <RegExTester/>, new: true}
        ]
    },
    'Web Tools': {
        icon: <Link className="w-5 h-5"/>,
        items: [
            {name: 'URL Transformer', description: 'Transform URLs', component: <UrlTransformer/>, new: true},
            {name: 'Base64', description: 'Encode/Decode Base64', component: <Base64/>, new: true},
            {name: 'JWT Decoder', description: 'Decode JWT tokens', component: <JWTDecoder/>, new: true},
            {name: 'HTTP Tester', description: 'Test HTTP requests'}
        ]
    },
    'Frontend Tools': {
        icon: <LayoutGrid className="w-5 h-5"/>,
        items: [
            {name: 'Color Converter', description: 'Convert between color formats', component: <ColorConverter/>, new: true},
            {name: 'CSS Generator', description: 'Generate CSS snippets'},
            {name: 'SVG Optimizer', description: 'Optimize SVG files'},
            {name: 'Responsive Helper', description: 'Test responsive designs'}
        ]
    },
    'Backend Tools': {
        icon: <Database className="w-5 h-5"/>,
        items: [
            {name: 'SQL Formatter', description: 'Format SQL queries'},
            {name: 'API Tester', description: 'Test API endpoints'},
            {name: 'Cron Generator', description: 'Generate cron expressions', component: <CronGenerator/>, new: true},
            {name: 'Hash Generator', description: 'Generate secure hashes'}
        ]
    },
    'IA Tools': {
        icon: <Code2 className="w-5 h-5"/>,
        items: [
            {
                name: 'Report Corrector and reformatter',
                description: 'Correct and reformat reports',
                component: <ReportFormatter/>,
                new: true
            },
        ]
    }
}