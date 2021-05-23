export default function AboutPage() {
  return (
    <>
      <h1>About Us</h1>
      <ul className="list-unstyled">
        <li>
          <strong>Lead Developer:</strong> Nat Budin (natbudin AT gmail DOT com)
        </li>
        <li>
          <strong>Curator:</strong> Eva Schiffer (valleyviolet AT gmail DOT com)
        </li>
        <li>
          A project of{' '}
          <a href="http://interactiveliterature.org">New England Interactive Literature</a>.
        </li>
      </ul>
      <p>
        Larp Library is made with Ruby on Rails, TypeScript, and React. The source code for the app
        is available <a href="https://github.com/neinteractiveliterature/larp_library">on Github</a>
        .
      </p>
    </>
  );
}
