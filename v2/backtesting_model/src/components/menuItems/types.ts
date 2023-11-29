export interface MenuItemProps<T> {
    title?: string,
    value?: T,
    valueChanged?: (value: T) => void;
}