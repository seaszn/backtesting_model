'use client'

import { Button } from "@nextui-org/react";
import { File } from "lucide-react";
import { open } from "@tauri-apps/api/dialog";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DataSetInfo, DataSetType } from "@/lib/hooks/useData/types";
import { useDataSet } from "@/lib/hooks/useData";
import { SelectReference } from "../selector";

export interface DataModalProperties {
    type: DataSetType,
    onSuccess?: (dataInfo: DataSetInfo) => void,
    reference: React.MutableRefObject<SelectReference>
}

export function ImportDataModal(properties: DataModalProperties) {
    let [isOpen, setIsOpen] = useState(false)
    
    const [name, setName] = useState("");
    const [filePath, setFilePath] = useState("");
    const [provider, setProvider] = useState("");
    const [url, setUrl] = useState("");
    
    const [nameError, setNameError] = useState("");
    const [filePathError, setFilePathError] = useState("");
    const [providerError, setProviderError] = useState("");
    const [urlError, setUrlError] = useState("");
    
    const dataSet = useDataSet(properties.type);
    
    properties.reference.current.Open = openModal;
    properties.reference.current.Close = closeModal;

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

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
        if (dataSet.values.find(x => x.name == name) != undefined) {
            //TODO: overwrite warning
        }

        name == "" ? setNameError("Name cannot be null") : setNameError("");
        filePath == "" ? setFilePathError("File path cannot be null") : setFilePathError("");
        provider == "" ? setProviderError("Provider cannot be null") : setProviderError("");

        if (url != "") {
            isValidUrl(url) ? setUrlError("") : setUrlError("Please provide a valid url");
        }

        if (nameError == "" && filePathError == "" && providerError == "" && urlError == "") {
            const dataSetInfo: DataSetInfo = {
                name: name,
                provider: provider,
                url: url,
                store_path: filePath
            }

            const response = await dataSet.import_data_set(dataSetInfo);
            if (typeof response === "string") {
                console.error(response);
            }
            else {
                properties.onSuccess?.(response as DataSetInfo);
                closeModal();
            }
        }
    }

    async function chooseFilePath() {
        const path = await open({
            multiple: false,
            filters: [{
                name: properties.type == DataSetType.Markets ? "Market" : "Indicator",
                extensions: ['csv']
            }]
        });

        if (path != null) {
            setFilePath(path as string);
        }
    }

    return (<Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
            <div className="fixed inset-0 z-auto" aria-hidden="true" />
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-black dark:text-white">
                                {properties.type == DataSetType.Markets ? "Import Market" : "Import Indicator"}
                            </Dialog.Title>
                            <div className="mx-auto max-w-xl mt-2">
                                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="h-0 border-b w-full mt-4 col-span-2 border-b-zinc-300 dark:border-b-zinc-700"></div>
                                    <div className="col-span-2">
                                        <label className="text-black dark:text-white text-sm">
                                            Name:
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => { setName(e.target.value) }}
                                            required={true}
                                            name="name"
                                            id="name"
                                            placeholder= {`The ${properties.type.valueOf()} name...`}
                                            autoComplete="given-name"
                                            className={(nameError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-lg mt-2 block w-full px-3.5 py-2 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:text-sm sm:leading-6"}
                                        />
                                        <label className=" w-full text-sm text-red-600 dark:text-red-700" hidden={nameError == ""}>{nameError}</label>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-black dark:text-white text-sm">
                                            File:
                                        </label>
                                        <div className="mt-2 flex">
                                            <input
                                                value={filePath}
                                                required={true}
                                                disabled={true}
                                                type="text"
                                                name="path"
                                                id="path"
                                                placeholder="Choose file path.."
                                                autoComplete="given-name"
                                                className={(filePathError != "" && filePath != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 border-none ") + " mr-4 block w-full px-3.5 py-2 border-b focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:text-sm sm:leading-6"}
                                            />

                                            <Button onClick={(e) => chooseFilePath()} variant="bordered" className={(filePathError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-lg min-w-0 w-10 h-10 border-1 bg-none ml-2 p-3 capitalize"}>
                                                <File className='w-10 h-10' />
                                            </Button>
                                        </div>
                                        <label className=" w-full text-sm text-red-600 dark:text-red-700" hidden={filePathError == ""}>{filePathError}</label>
                                    </div>
                                    <div >
                                        <label className="text-black dark:text-white text-sm">
                                            Provider:
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                onChange={(e) => { setProvider(e.target.value) }}
                                                required={true}
                                                name="provider"
                                                id="provider"
                                                placeholder="The provider's name..."
                                                autoComplete="given-name"
                                                className={(providerError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-lg mt-2 block w-full px-3.5 py-2 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:text-sm sm:leading-6"}
                                            />
                                        </div>
                                        <label className=" bg-zinc w-full text-sm text-red-600 dark:text-red-700" hidden={providerError == ""}>{providerError}</label>
                                    </div>
                                    <div >
                                        <label className="text-black dark:text-white text-sm">
                                            Url:
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                onChange={(e) => { setUrl(e.target.value) }}
                                                required={true}
                                                name="url"
                                                id="url"
                                                placeholder={`The ${properties.type.valueOf()}'s url...`}
                                                autoComplete="given-name"
                                                className={(urlError != "" ? "border-red-600 dark:border-red-700" : "border-zinc-300 dark:border-zinc-700 ") + " rounded-lg mt-2 block w-full px-3.5 py-2 border-1 focus-visible:border-transparent focus-visible:dark:bg-zinc-700 focus-visible:outline-none transition-all shadow-sm placeholder:text-zinc-600 dark:placeholder:text-zinc-400 dark:text-white bg-transparent sm:text-sm sm:leading-6"}
                                            />
                                        </div>
                                        <label className=" w-full text-sm text-red-600 dark:text-red-700" hidden={urlError == ""}>{urlError}</label>
                                    </div>
                                    <Button variant='bordered' className=' mt-8 rounded-lg border-1 enabled:hover:bg-red-500 enabled:border-red-500 enabled:active:hover:bg-red-600 dark:enabled:hover:bg-red-700 dark:enabled:active:bg-red-800 disabled:opacity-50 transition-all' onClick={() => closeModal()}>
                                        Cancel
                                    </Button>
                                    <Button variant='bordered' className='mt-8 border-1 rounded-lg enabled:hover:bg-green-500 enabled:border-green-500 enabled:active:hover:bg-green-600 dark:enabled:hover:bg-green-700 dark:enabled:active:bg-green-800 disabled:opacity-50 transition-all' onClick={async () => await onSubmit()}>
                                        Upload
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 w-full bg-white">
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
    )
}