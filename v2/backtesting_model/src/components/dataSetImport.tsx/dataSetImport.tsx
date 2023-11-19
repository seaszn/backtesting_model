import { DataSetType, import_data_set, useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo, DataSetState } from "@/lib/hooks/useData/types";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch } from "@nextui-org/react";
import { ChevronDownIcon, File, Upload } from "lucide-react";
import { open } from "@tauri-apps/api/dialog";
import { Fragment, useEffect, useState } from "react";
import { TimeFrames } from "@/app/chart/types";
import { Menu, Transition } from "@headlessui/react";

export interface ImportDataSetProps {
    onSuccess?: (dataInfo: DataSetInfo, type: DataSetType) => void,
    // reference: React.MutableRefObject<SelectReference>
}

export function ImportDataSet(properties: ImportDataSetProps) {
    const [type, updateType] = useState(DataSetType.Indicators);

    const [name, setName] = useState("");
    const [filePath, setFilePath] = useState("");
    const [provider, setProvider] = useState("");
    const [url, setUrl] = useState("");

    const [nameError, setNameError] = useState("");
    const [filePathError, setFilePathError] = useState("");
    const [providerError, setProviderError] = useState("");
    const [urlError, setUrlError] = useState("");

    function isValidUrl(urlString: string) {
        var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
        return !!urlPattern.test(urlString);
    }

    async function onSubmit() {
        const isNameError = (() => {
            if (name == "") {
                setNameError("Name cannot be null")
                return true;
            }

            return false;
        })();

        const isFilePathError = (() => {
            if (filePath == "") {
                setFilePathError("File path cannot be null")
                return true;
            }

            return false;
        })();

        const isProviderError = (() => {
            if (provider == "") {
                setProviderError("Provider cannot be null")
                return true;
            }

            return false;
        })();

        const isUrlError = (() => {
            if (url == "") {
                return false;
            }
            else if (isValidUrl(url)) {
                return false
            }
            else {
                setUrlError("Not a valid url")
                return true;
            }
        })();

        if (!isNameError && !isFilePathError && !isProviderError && !isUrlError) {
            const dataSetInfo: DataSetInfo = {
                name: name,
                provider: provider,
                url: url,
                store_path: filePath
            }


            const response = await import_data_set(type, dataSetInfo);
            if (typeof response === "string") {
                console.error(response);
            }
            else {
                properties.onSuccess?.(response as DataSetInfo, type);
                // closeModal();
            }
        }
    }

    function clear() {
        setName("");
        setFilePath("");
        setProvider("");
        setUrl("");

        setNameError("");
        setFilePathError("");
        setProviderError("");
        setUrlError("");
    }

    async function chooseFilePath() {
        const path = await open({
            multiple: false,
            filters: [{
                name: "Dataset",
                extensions: ['csv']
            }]
        });

        if (path != null) {
            setFilePath(path as string);
            setFilePathError("");
        }
    }

    return (
        <div className="grid border-t overflow-y-auto pb-2 pt-4 grid-cols-1 gap-x-4 gap-y-2 mt-2 border-zinc-300 dark:border-zinc-700 sm:grid-cols-2">
            <div className="col-span-2 text-xs">
                <div className="w-full h-auto flex">
                    <label className="text-zinc-300 grow font-semibold dark:text-zinc-600">
                        Name:
                    </label>
                    <label className=" self-end text-right w-full text-xs text-red-600 dark:text-red-700" hidden={nameError == ""}>{nameError}</label>
                </div>
                <input
                    type="text"
                    onChange={(e) => { setName(e.target.value); setNameError("") }}
                    required={true}
                    name="name"
                    id="name"
                    placeholder="Dataset name..."
                    className={(nameError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-md px-2 mt-2 block w-full p-1 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:leading-6"}
                />
            </div>
            <div className="col-span-2 text-xs mt-2">
                <div className="w-full h-auto flex">
                    <label className="text-zinc-300 grow w-20 font-semibold dark:text-zinc-600">
                        File Path:
                    </label>
                    <label className=" self-end text-right w-full text-xs text-red-600 dark:text-red-700" hidden={filePathError == ""}>{filePathError}</label>
                </div>
                <div className="flex pt-2">
                    <div style={{ textOverflow: "clip" }} className={(filePathError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " overflow-hidden rounded-md px-2 mtblock w-full p-1 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:leading-6"}>
                        <p className={(filePath == "" ? "text-zinc-700 dark:text-zinc-300" : "dark:text-white text-black overflow-ellipsis") + " overflow-hidden whitespace-nowrap"}>{filePath == "" ? "Select dataset path..." : filePath}</p>
                    </div>
                    <Button onClick={(e) => chooseFilePath()} variant="bordered" className={(filePathError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-md min-w-0 w-8 h-8 border-1 bg-none ml-2 p-2 capitalize"}>
                        <File className='w-8 h-8' />
                    </Button>
                </div>
            </div>
            <div className="text-xs mt-2">
                <div className="w-full h-auto">
                    <label className="text-zinc-300 grow font-semibold dark:text-zinc-600">
                        Provider:
                    </label>
                </div>
                <input
                    type="text"
                    onChange={(e) => { setProvider(e.target.value); setProviderError(""); }}
                    required={true}
                    name="provider"
                    id="provider"
                    placeholder="Dataset provider..."
                    autoComplete="given-name"
                    className={(providerError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-md px-2 mt-2 block w-full p-1 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:leading-6"}
                />
                <label className=" w-full text-xs text-red-600 dark:text-red-700" hidden={providerError == ""}>{providerError}</label>
            </div>
            <div className="text-xs mt-2 ">
                <div className="w-full h-auto">
                    <label className="text-zinc-300 grow font-semibold dark:text-zinc-600">
                        Url:
                    </label>
                </div>
                <input
                    type="text"
                    onChange={(e) => { setUrl(e.target.value); setUrlError("") }}
                    required={true}
                    name="name"
                    id="name"
                    placeholder="Dataset source url..."
                    autoComplete="given-name"
                    className={(urlError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-md px-2 mt-2 block w-full p-1 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:leading-6"}
                />
                <label className="w-full text-xs text-red-600 dark:text-red-700" hidden={urlError == ""}>{urlError}</label>
            </div>
            <div className="text-xs mt-2 ">
                <div className="w-full h-auto">
                    <label className="text-zinc-300 grow font-semibold dark:text-zinc-600">
                        Type:
                    </label>
                </div>

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="capitalize mt-2 text-xs h-8 w-full rounded-md border-1 border-zinc-300 dark:border-zinc-700">
                            {type}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Single selection example"
                        variant="faded"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={"none"}
                        className="dark:bg-zinc-900 bg-zinc-100 overflow-hidden border-zinc-200 dark:border-zinc-700 rounded-md p-0">
                        {
                            Object.values(DataSetType).map((value) => (
                                <DropdownItem key={value.valueOf()} onClick={() => updateType(value)} variant='flat' className='dark:text-white border-zinc-200 dark:border-zinc-700 text-black border-b rounded-none m-0 p-2 text-xs max-h-8 font-normal'>{value}</DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Button variant='bordered' className='mt-8 border-1 text-xs rounded-md h-8 enabled:hover:bg-green-500 enabled:border-green-500 enabled:active:hover:bg-green-600 dark:enabled:hover:bg-green-700 dark:enabled:active:bg-green-800 disabled:opacity-50 transition-all' onClick={async () => await onSubmit()}>
                Upload
            </Button>
        </div>
    )
}