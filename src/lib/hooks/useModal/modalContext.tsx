import { ParentComponentProperties } from '@/app/types';
import React, { Context, useEffect, MutableRefObject } from 'react'
import useModal, { DEFAULT_OPTIONS, ModalOptions } from './useModal';
import { Modal } from './modal';


interface ModalContextType {
    updateModal?: (options?: ModalOptions | undefined) => void,
    content?: React.ReactNode,
    options: ModalOptions
    visible: boolean,
}

const DEFAULT_CONTEXT: ModalContextType = {
    visible: false,
    options: DEFAULT_OPTIONS
}

let ModalContext: Context<ModalContextType>;
const { Provider } = (ModalContext = React.createContext(DEFAULT_CONTEXT));


function ModalProvider(properties: ParentComponentProperties) {
    const { visible, updateModal, options } = useModal( DEFAULT_CONTEXT.visible, DEFAULT_CONTEXT.options);

    return (
        <Provider value={{ visible, updateModal, options }}>
            <Modal />
            <div className='relative' id="modal-root"></div>
            {properties.children}
        </Provider>
    )
}

export { ModalContext, ModalProvider };
