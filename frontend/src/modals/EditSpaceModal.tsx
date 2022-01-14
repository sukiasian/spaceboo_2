import SpaceInputFieldsForCreateAndEdit from '../components/SpaceInputFieldsForCreateAndEdit';

export default function EditSpaceModal(): JSX.Element {
    return (
        <div className="edit-space-modal">
            <form className="edit-space-form">
                <SpaceInputFieldsForCreateAndEdit
                    buttonClassName="button button--primary button--submit"
                    buttonText={'Обновить данные'}
                    componentIsFor={'editSpaceData'}
                    handleSubmitButton={() => {}}
                />
            </form>
        </div>
    );
}
