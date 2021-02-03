export const MailchimpPopup = () => (
    <div>
        <script type="text/javascript" src="//downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: 'window.dojoRequire(["mojo/signup-forms/Loader"], function (L) { L.start({ "baseUrl": "mc.us19.list-manage.com", "uuid": "da6d67bd7f3ba3a760d0dd2a6", "lid": "ce423cd6f3", "uniqueMethods": true }) })' }}></script>
    </div>
)