import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faPhone } from '@fortawesome/free-solid-svg-icons';
import Titles from '../components/Titles';

interface IContactData {
    email?: string;
    phone?: string;
}

interface IContacts {
    troubles: IContactData;
    ideas: IContactData;
    questions: IContactData;
    investors: IContactData;
}

export default function ContactUsPage(): JSX.Element {
    const [topicDropdownMenuIsOpen, setTopicDropdownMenuIsOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState('');
    const topicNames = ['У меня проблема...', 'У меня идея...', 'У меня вопрос...', 'Я - инвестор...'];
    const contacts: IContacts = {
        troubles: {
            email: 'info@spaceboo.com',
            phone: '+79649059722',
        },
        ideas: {
            email: 'team@spaceboo.com',
        },
        questions: {
            email: 'info@spaceboo.com',
        },
        investors: {
            email: 'sam@spaceboo.com',
            phone: '+79649059722',
        },
    };
    const topicDropdownRef = useRef<HTMLDivElement>(null);
    const hideDropdownOnOutsideClick = (e: MouseEvent): void => {
        if (e.target !== topicDropdownRef.current) {
            toggleTopicDropdownMenu();
        }
    };
    const applyEventListeners = (): (() => void) => {
        if (topicDropdownRef.current) {
            document.addEventListener('click', hideDropdownOnOutsideClick);
        }

        return () => {
            document.removeEventListener('click', hideDropdownOnOutsideClick);
        };
    };
    const defineActiveClassForDropdown = (topicName: string): string => {
        return topicName === activeTopic ? 'active' : '';
    };
    const toggleTopicDropdownMenu = (): void => {
        setTopicDropdownMenuIsOpen(!topicDropdownMenuIsOpen);
    };
    const pickActiveTopic = (topic: string): (() => void) => {
        return () => {
            setActiveTopic(topic);
            toggleTopicDropdownMenu();
        };
    };
    const renderTopicDropdownMenu = (): JSX.Element | void => {
        if (topicDropdownMenuIsOpen) {
            const topics = topicNames.map((topic: string, i: number) => (
                <div className="paragraph-container" onClick={pickActiveTopic(topic)} key={i}>
                    <p className={`paragraph drop-down-menu-option ${defineActiveClassForDropdown(topic)}`}>{topic}</p>
                </div>
            ));

            return (
                <div className="drop-down contact-topic-dropdown-menu" ref={topicDropdownRef}>
                    {topics}
                </div>
            );
        }
    };
    const renderChooseTopicTipOrActiveTopicForDropdown = (): string => {
        return activeTopic.length ? activeTopic : 'Выберите тему...';
    };
    const renderChooseTopicTipInContactData = (): JSX.Element | void => {
        if (!activeTopic) {
            return (
                <div className="choose-topic-tip paragraph-container">
                    <p className="paragraph">Пожалуйста, выберите тему обращения.</p>
                </div>
            );
        }
    };
    const renderEmail = (email: string): JSX.Element => {
        return (
            <div className="contact-data__field email paragraph-container">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faAt} />
                </div>
                <div className="paragraph-container">
                    <p className="contact__data contact__data--email paragraph--m">{email}</p>
                </div>
            </div>
        );
    };
    const renderPhone = (phone: string): JSX.Element => {
        return (
            <div className="contact-data__field phone paragraph-container">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="paragraph-container">
                    <p className="contact__data contact__data--phone paragraph--m">{phone}</p>
                </div>
            </div>
        );
    };
    const renderContactDataForTroubles = (): JSX.Element | void => {
        if (activeTopic === topicNames[0]) {
            const { email, phone } = contacts.troubles;

            return (
                <div className="contact-data-in-case-of-trouble">
                    <div className="paragraph-container">
                        <p className="paragraph">
                            Если вопрос связан с определенной проблемой, пожалуйста, свяжитесь с нами по эл. почте либо
                            по номеру телефона, указанными ниже.
                        </p>
                    </div>
                    <div className="contact-data">
                        <div className="contact-data__decoration" />
                        <div className="contact-data__fields">
                            {renderEmail(email!)}
                            {renderPhone(phone!)}
                        </div>
                    </div>
                </div>
            );
        }
    };
    const renderContactDataForIdeas = (): JSX.Element | void => {
        if (activeTopic === topicNames[1]) {
            const { email } = contacts.ideas;

            return (
                <div className="contact-data-in-case-of-idea">
                    <div className="paragraph-container">
                        <p className="paragraph">
                            Мы глубоко ценим идеи и будем рады выслушать Ваши - свяжитесь с нами.
                        </p>
                    </div>
                    <div className="contact-data">
                        <div className="contact-data__decoration" />
                        <div className="contact-data__fields">{renderEmail(email!)}</div>
                    </div>
                </div>
            );
        }
    };
    const renderContactDataForQuestions = (): JSX.Element | void => {
        if (activeTopic === topicNames[2]) {
            const { email } = contacts.questions;

            return (
                <div className="contact-data-in-case-of-idea">
                    <div className="paragraph-container">
                        <p className="paragraph">Пожалуйста, опишите Ваш вопрос детально. Мы будем рады Вам помочь:</p>
                    </div>
                    <div className="contact-data">
                        <div className="contact-data__decoration" />
                        <div className="contact-data__fields">{renderEmail(email!)}</div>
                    </div>
                </div>
            );
        }
    };
    const renderContactDataForInvestors = (): JSX.Element | void => {
        if (activeTopic === topicNames[3]) {
            const { email, phone } = contacts.investors;

            return (
                <div className="contact-data-in-case-of-idea">
                    <div className="paragraph-container">
                        <p className="paragraph">
                            Если вы заинтересованы в том, чтобы инвестировать, пожалуйста, напишите нам на почту или
                            позвоните по номеру телефона, указанными ниже.
                        </p>
                    </div>
                    <div className="contact-data">
                        <div className="contact-data__decoration" />
                        <div className="contact-data__fields">
                            {renderEmail(email!)}
                            {renderPhone(phone!)}
                        </div>
                    </div>
                </div>
            );
        }
    };

    useEffect(applyEventListeners);

    return (
        <div className="page contact-page">
            <Titles heading="Связаться" paragraph="Есть вопросы? Свяжитесь с нами!" />
            <div className="contact-box">
                <div className="contact-box__topic">
                    <div className="choose-topic paragraph-container" onClick={toggleTopicDropdownMenu}>
                        <p className="paragraph">{renderChooseTopicTipOrActiveTopicForDropdown()}</p>
                    </div>
                    {renderTopicDropdownMenu()}
                </div>
                <div className="contact-box__data">
                    {renderChooseTopicTipInContactData()}
                    {renderContactDataForTroubles()}
                    {renderContactDataForIdeas()}
                    {renderContactDataForQuestions()}
                    {renderContactDataForInvestors()}
                </div>
            </div>
        </div>
    );
}
