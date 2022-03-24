interface ICustomPrompt {
    promptMessage: string;
}

export default function CustomPrompt(props: ICustomPrompt): JSX.Element {
    const { promptMessage } = props;

    return (
        <div className="custom-prompt">
            <div className="custom-prompt__message">
                <p className="paragraph paragraph--prompt-message">{promptMessage}</p>
            </div>
            <div className="custom-prompt__responses">
                <div>Да</div>
                <div>Отмена</div>
            </div>
        </div>
    );
}
