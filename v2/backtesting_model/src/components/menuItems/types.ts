

export interface MenuItemProps<T extends MenuItemValue> {
    title?: string,
    value?: T,
    valueChanged?: (value: T) => void;
    cancelled?: () => void
}