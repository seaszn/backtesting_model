import React, { useState } from 'react'

export interface ModalOptions {
    backdrop: boolean,
    allowClose: boolean,
    content?: React.ReactNode,
    closeOnClickOutside: boolean,
    title: string
}

export const DEFAULT_OPTIONS: ModalOptions = {
    backdrop: false,
    content: undefined,
    closeOnClickOutside: false,
    title: "Title",
    allowClose: true
}


export default (startVisible: boolean, properties: ModalOptions) => {
    const [visible, setVisible] = useState(startVisible);
    const [title, setTitle] = useState(properties.title)
    const [allowClose, setAllowClsoe] = useState(properties.allowClose)
    const [backdrop, setBackdrop] = useState(properties.backdrop);
    const [closeOnClickOutside, setCloseOutsiteClick] = useState(properties.closeOnClickOutside)
    const [content, setContent] = useState<React.ReactNode>()

    function showModal(options: ModalOptions | undefined) {
        if (options != undefined) {
            setVisible(true);
            setContent(options.content);
            setAllowClsoe(options.allowClose);
            setBackdrop(options.backdrop);
            setCloseOutsiteClick(options.closeOnClickOutside);
            setTitle(options.title)
        }
        else {
            setVisible(false);
        }
    }

    return { visible, updateModal: showModal, options: { backdrop, content, closeOnClickOutside, title, allowClose } }
}