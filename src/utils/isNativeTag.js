export default function isNativeTag(tag) {
    return ['div', 'span', 'h1', 'h2', 'h3',
        'h4', 'h5', 'h6', 'nav', 'section',
        'header', 'footer', 'a', 'p', 'i',
        'input', 'button', 'ul', 'ol', 'li',
        'table'].includes(tag)
}