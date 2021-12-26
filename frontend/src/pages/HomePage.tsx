import Filters from '../components/Filters';

export function HomePage(props: any) {
    return (
        <section className="section-homepage">
            <div className="slider"></div>
            <Filters />
        </section>
    );
}
