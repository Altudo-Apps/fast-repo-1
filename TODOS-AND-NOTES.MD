* FastLane comes with a Global shared site - this is where the styles, variants, page designs, partial designs, etc should be created.  The other sites created will inherit everything.  Take special care in deciding to make something specific to a site.  Perhaps we need a matrix.

* Component mapping was a confusing process.  We need a standard to help guide when things are a component.  For example - if the data source is different - it's a different component.  Things get more confusing when to decided whether or not it should be a variant or a new component.

* There was also confusion about what is a component and what is not.

* There was confusion about how we should create stories.  Because we are using designs, the best thing possible is to find the smallest unit of work.  For example, if you have a blog landing page, and there is a component that has recent articles, and the recent articles display a list of blog cards, and the blog card looks almost identical to a card, but it has a small difference between the card - that there is an article date; then the smallest unit of work is the blog card.  NOTE: you may be able to reuse the card inside of the blog card - however the html and data model would be different because of the article date.

