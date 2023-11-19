import { SubMenu, SubMenuTab } from "@/components/subMenu";
import { BaseMenuState, SubMenuReference } from "@/components/subMenu/subMenu";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { preProcessFile } from "typescript";

export interface ConfigWindowMenuProps {
    reference?: React.MutableRefObject<SubMenuReference<ConfigSubMenuState>>,
}

export enum ConfigSubMenuState {
    UploadDataSet,
    SelectMarket,
    SelectIndicator,
}

export function ConfigWindowMenu(properties: ConfigWindowMenuProps) {
    const [subMenuState, setSubMenuState] = useState<BaseMenuState | ConfigSubMenuState>(BaseMenuState.Collapsed)

    if (properties.reference) {
        properties.reference.current.setMenuState = (state: BaseMenuState | ConfigSubMenuState) => {
            setSubMenuState(state);
            console.log("test")
        };
    }

    return (
        <SubMenu state={subMenuState}>
            <SubMenuTab title={"Select Market"} type={ConfigSubMenuState.SelectMarket} state={subMenuState} setSubMenuState={setSubMenuState}>
                <Button>Test</Button>
            </SubMenuTab>
            <SubMenuTab title={"Select Indicator"} type={ConfigSubMenuState.SelectIndicator} state={subMenuState} setSubMenuState={setSubMenuState}>
                <Button>Test</Button>
            </SubMenuTab>
            <SubMenuTab title={"Upload Dataset"} type={ConfigSubMenuState.UploadDataSet} state={subMenuState} setSubMenuState={setSubMenuState}>
                <Button>Test</Button>
            </SubMenuTab>
        </SubMenu>
    )
}