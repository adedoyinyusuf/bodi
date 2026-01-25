import { Navigation } from '@/components/navigation'

export default function About() {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-to-br from-background via-background to-muted py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance tracking-tight">
              About Bodi
            </h1>
            <p className="text-xl text-muted-foreground font-light">
              Redefining electronics discovery through thoughtful design and authentic engagement
            </p>
          </div>
        </section>
        
        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
          {/* Our Story */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed font-light text-lg">
              Bodi emerged from a singular vision: to elevate how the world discovers exceptional electronics. We believe that technology deserves the reverence of fine art—curated, celebrated, and experienced authentically. Every product in our collection represents innovation refined through thoughtful design and uncompromising quality.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light text-lg">
              We've crafted a platform where refined taste meets genuine connection. Our immersive galleries, interactive engagement, and carefully selected masterpieces create an experience that transcends ordinary product discovery.
            </p>
          </div>
          
          {/* Our Mission */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Our Mission</h2>
            <div className="space-y-3">
              <div className="p-6 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2 text-lg">Curation Excellence</h3>
                <p className="text-muted-foreground text-sm font-light">
                  We handpick masterpieces from visionary brands, ensuring every product embodies innovation and craftsmanship.
                </p>
              </div>
              
              <div className="p-6 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2 text-lg">Authentic Engagement</h3>
                <p className="text-muted-foreground text-sm font-light">
                  Connect with a discerning community. Like, comment, and share to celebrate exceptional design together.
                </p>
              </div>
              
              <div className="p-6 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2 text-lg">Elevated Discovery</h3>
                <p className="text-muted-foreground text-sm font-light">
                  Multi-dimensional galleries, unfiltered insights, and immersive experiences that honor the craft of innovation.
                </p>
              </div>
            </div>
          </div>
          
          {/* Values */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Sophistication',
                  description: 'Refining the way technology is discovered, celebrated, and shared',
                },
                {
                  title: 'Authenticity',
                  description: 'Uncompromising honesty in every product, every interaction, every detail',
                },
                {
                  title: 'Craftsmanship',
                  description: 'Devoted to the pursuit of excellence in design and user experience',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="p-8 bg-card border border-border rounded-lg text-center hover:border-primary/40 transition-colors"
                >
                  <h3 className="font-semibold text-foreground mb-3 text-lg">{value.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Why Choose */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Why Bodi?</h2>
            <ul className="space-y-3 text-muted-foreground leading-relaxed font-light">
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-primary font-bold text-lg mt-1">✦</span>
                <span className="text-base">Handpicked masterpieces from innovators redefining the world</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-primary font-bold text-lg mt-1">✦</span>
                <span className="text-base">Immersive galleries revealing every dimension and detail</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-primary font-bold text-lg mt-1">✦</span>
                <span className="text-base">Connect meaningfully with a community of discerning enthusiasts</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-primary font-bold text-lg mt-1">✦</span>
                <span className="text-base">Seamless communication through WhatsApp</span>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-primary font-bold text-lg mt-1">✦</span>
                <span className="text-base">Elegant interface, refined experience, secure throughout</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}
