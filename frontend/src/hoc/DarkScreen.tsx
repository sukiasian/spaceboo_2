interface IDarkScreenProps {
    children: JSX.Element;
}

export default function DarkScreen({ children }: IDarkScreenProps): JSX.Element {
    return <div className="dark-screen">{children}</div>;
}
