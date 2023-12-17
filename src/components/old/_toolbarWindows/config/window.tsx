// import { TimeFrame, TimeFrames } from "@/app/chart/types";
// import { useDataSet } from "@/lib/hooks/useData";
// import { DataSetInfo, DataSetType } from "@/lib/hooks/useData/types";
// import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
// import { Upload, X } from "lucide-react";
// import { useState } from "react";
// import { SubMenuTab } from "../../_subMenu/subMenuTab";
// import { BaseMenuState, SubMenu } from "@/components/_subMenu/subMenu";
// import { DataSetSelect } from "@/components/_dataSetSelect";
// import { ImportDataSet } from "@/components/_dataSetImport.tsx/dataSetImport";

// interface ConfigWindowProps {
// }

// export enum ConfigSubMenuState {
//     UploadDataSet,
//     SelectMarket,
//     SelectIndicator,
// }

// export function ConfigWindow(properties: ConfigWindowProps) {
//     const indicators = useDataSet(DataSetType.Indicators);
//     const markets = useDataSet(DataSetType.Markets);

//     const [currentIndicator, updateIndicator] = useState(indicators.current())
//     const [currentMarket, updateMarket] = useState(markets.current())
//     const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);
//     const [subMenuState, setSubMenuState] = useState<BaseMenuState | ConfigSubMenuState>(ConfigSubMenuState.SelectMarket)

//     function onTimeFrameChanged(timeFrame: TimeFrame) {
//         localStorage.setItem("selected_time_frame", timeFrame);
//         selectTimeFrame(timeFrame);
//     }

//     function onMarketSelected(dataSet: DataSetInfo) {
//         markets.select_data_set(dataSet);
//         updateMarket(dataSet);
//     }

//     function onIdicatorSelected(dataSet: DataSetInfo) {
//         indicators.select_data_set(dataSet);
//         updateIndicator(dataSet);
//     }

//     return (
//         <div className="relative flex flex-col justify-end h-full">
//             <div className="grow flex flex-col overflow-hidden p-4">
//                 <div className="items-center border-b pb-4 px-2 pt-1.5 border-zinc-200 dark:border-zinc-700">
//                     <h1 className="font-semibold dark:text-white">Settings</h1>
//                 </div>
//                 <div className=" overflow-y-auto">
//                     <div className=" grow flex pt-4 flex-col">
//                         <div className="grid gap-1 grow">
//                             <div className="w-full  h-full grid">
//                                 <div>
//                                     <p className='dark:text-zinc-500 pb-1 font-semibold text-tiny text-zinc-400'>Market:</p>
//                                     <div className='w-full flex flex-row'>
//                                         <Button variant="bordered" onClick={() => setSubMenuState(ConfigSubMenuState.SelectMarket)} className=" text-xs border-1 border-zinc-300 w-8 h-8 rounded-md dark:border-zinc-700 capitalize grow text-left justify-start">
//                                             {currentMarket?.name}
//                                         </Button>
//                                         <Button onClick={() => setSubMenuState(ConfigSubMenuState.UploadDataSet)} variant="bordered" className=" text-xs rounded-md min-w-0 w-8 h-8 border-1 border-zinc-300 dark:border-zinc-700 ml-2 p-2 capitalize">
//                                             <Upload className='w-10 h-10' />
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4">
//                                     <p className='dark:text-zinc-500 pb-1 font-semibold text-xs text-zinc-400'>Indicator:</p>
//                                     <div className='w-full flex flex-row'>
//                                         <Button variant="bordered" onClick={() => setSubMenuState(ConfigSubMenuState.SelectIndicator)} className=" text-xs border-1 border-zinc-300 h-8 rounded-md dark:border-zinc-700 capitalize grow text-left justify-start">
//                                             {currentIndicator?.name}
//                                         </Button>
//                                         <Button onClick={() => setSubMenuState(ConfigSubMenuState.UploadDataSet)} variant="bordered" className=" text-xs rounded-md min-w-0 w-8 h-8 border-1 border-zinc-300 dark:border-zinc-700 ml-2 p-2 capitalize">
//                                             <Upload className='w-10 h-10' />
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-700">
//                                     <p className='dark:text-zinc-500 pb-1 font-semibold pt-2 text-tiny text-zinc-400'>Time Frame:</p>
//                                     <Dropdown>
//                                         <DropdownTrigger>
//                                             <Button variant="bordered" className="text-xs capitalize w-full rounded-md h-8 border-1 border-zinc-300 dark:border-zinc-700">
//                                                 {currentTimeFrame}
//                                             </Button>
//                                         </DropdownTrigger>
//                                         <DropdownMenu
//                                             aria-label="Single selection example"
//                                             variant="flat"
//                                             disallowEmptySelection
//                                             selectionMode="single"
//                                             selectedKeys="none">
//                                             {TimeFrames.map((value) => (
//                                                 <DropdownItem key={value} variant='flat' className='dark:text-white h-8 text-xs text-black rounded-md' onClick={(e) => onTimeFrameChanged(value)}>{value}</DropdownItem>
//                                             ))}
//                                         </DropdownMenu>
//                                     </Dropdown>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <SubMenu state={subMenuState}>
//                 <SubMenuTab title={"Select Market"} type={ConfigSubMenuState.SelectMarket} state={subMenuState} setSubMenuState={setSubMenuState}>
//                     <DataSetSelect type={DataSetType.Markets} onSelect={onMarketSelected} dataSet={markets} />
//                 </SubMenuTab>
//                 <SubMenuTab title={"Select Indicator"} type={ConfigSubMenuState.SelectIndicator} state={subMenuState} setSubMenuState={setSubMenuState}>
//                     <DataSetSelect type={DataSetType.Indicators} onSelect={onIdicatorSelected} dataSet={indicators} />
//                 </SubMenuTab>
//                 <SubMenuTab title={"Upload Dataset"} type={ConfigSubMenuState.UploadDataSet} state={subMenuState} setSubMenuState={setSubMenuState}>
//                     <ImportDataSet onSuccess={(e, t) => {
//                         switch (t) {
//                             case DataSetType.Indicators:
//                                 indicators.select_data_set(e);
//                                 updateIndicator(e);
//                                 setSubMenuState(BaseMenuState.Collapsed)
//                                 break;
//                             case DataSetType.Markets:
//                                 markets.select_data_set(e);
//                                 updateMarket(e);
//                                 setSubMenuState(BaseMenuState.Collapsed)
//                                 break;
//                         }
//                     }} />
//                 </SubMenuTab>
//             </SubMenu>
//         </div>
//     )
// }