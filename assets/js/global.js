import svg4everybody from 'svg4everybody';

function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('../icons', true, /\.svg$/));

class Global {
    init() {
        svg4everybody();
    }
}

export default Global;
