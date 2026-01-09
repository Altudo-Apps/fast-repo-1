import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import scConfig from 'sitecore.config';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const nextDataProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    const layout = nextDataProps?.page?.layout;
    const siteName = nextDataProps?.page?.siteName?.toLowerCase() || scConfig.defaultSite;
    const mainClassPageEditing = nextDataProps?.page?.mode?.pageEditing
      ? 'editing-mode'
      : 'prod-mode';

    return (
      <Html suppressHydrationWarning>
        <Head>{layout?.sitecore ? <SitecoreStyles layoutData={layout} /> : null}</Head>
        <body>
          <div className={`${siteName} ${mainClassPageEditing}`}>
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
