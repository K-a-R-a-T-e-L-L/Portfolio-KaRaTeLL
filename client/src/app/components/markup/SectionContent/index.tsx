import About from '../../content/About';
import Contacts from '../../content/Contacts';
import Projects from '../../content/Projects';
import Resume from '../../content/Resume';
import Skills from '../../content/Skillls';
import style from './styles.module.scss';

const SectionContent = ({ currentComponent }: {currentComponent: string}) => {

    const renderPage = () => {
        switch (currentComponent) {
            case 'About':
                return <About />;
            case 'Skills':
                return <Skills />;
            case 'Projects':
                return <Projects />;
            case 'Contacts':
                return <Contacts />;
            case 'Resume':
                return <Resume />;
            default:
                return <About />;
        };
    };

    return (
        <>
            <section className={style.section}>
                {renderPage()}
            </section>
        </>
    );
};

export default SectionContent;