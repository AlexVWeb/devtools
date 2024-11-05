import Image from "next/image";
import TextTransform from "@/app/components/TextTransform";
import UrlTransformer from "@/app/components/UrlTransformer";
import JiraToGit from "@/app/components/JiraToGit";

export default function Home() {
    return (
        <main className="font-sans flex flex-col items-center justify-between">
            <div className="">
                <JiraToGit/>
                <TextTransform/>
                <UrlTransformer/>
            </div>
        </main>
    );
}
