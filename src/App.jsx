
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, CircleUserRound, CreditCard, Heart, Menu, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'
import './App.css'

const products = [
  { id: 1, name: 'Wireless Studio Headphones', category: 'Electronics', price: 68000, oldPrice: 82000, rating: '4.9', reviews: 124, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85', description: 'Immersive sound and an all-day comfortable fit.' },
  { id: 2, name: 'Everyday Classic Sneakers', category: 'Fashion', price: 54000, oldPrice: 65000, rating: '4.8', reviews: 86, badge: 'Popular', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85', description: 'A versatile everyday pair made for comfort.' },
  { id: 3, name: 'Minimal Silver Watch', category: 'Fashion', price: 72000, oldPrice: null, rating: '4.7', reviews: 53, badge: 'New arrival', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85', description: 'A clean, timeless watch for workdays and weekends.' },
  { id: 4, name: 'Compact Digital Camera', category: 'Electronics', price: 185000, oldPrice: 210000, rating: '4.9', reviews: 42, badge: 'Limited offer', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=85', description: 'Capture everyday moments with crisp photos.' },
  { id: 5, name: 'Modern Table Lamp', category: 'Home', price: 39000, oldPrice: null, rating: '4.6', reviews: 31, badge: 'Home pick', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85', description: 'Soft ambient lighting for a welcoming space.' },
  { id: 6, name: 'Daily Skincare Set', category: 'Beauty', price: 46000, oldPrice: 52000, rating: '4.8', reviews: 67, badge: 'Customer favourite', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&auto=format&fit=crop&q=85', description: 'A simple daily routine with selected essentials.' },
  { id: 7, name: 'Polarized Sunglasses', category: 'Fashion', price: 32000, oldPrice: null, rating: '4.5', reviews: 28, badge: '', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=85', description: 'Lightweight frames with a minimal look.' },
  { id: 8, name: 'Smart Fitness Watch', category: 'Electronics', price: 96000, oldPrice: 112000, rating: '4.7', reviews: 91, badge: 'Smart pick', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=85', description: 'Track activity, notifications and daily goals.' },
]
const categories = ['All products', 'Electronics', 'Fashion', 'Home', 'Beauty']
const money = (amount) => 'RWF ' + Number(amount).toLocaleString('en-US')
const getSavedCart = () => {
  try { return JSON.parse(localStorage.getItem('momo-shop-cart') || '[]') } catch { return [] }
}

function App() {
  const [cart, setCart] = useState(getSavedCart)
  const [category, setCategory] = useState('All products')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => { localStorage.setItem('momo-shop-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All products' || category === product.category
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [product.name, product.category, product.description].join(' ').toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  }), [category, search])
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal === 0 || subtotal >= 100000 ? 0 : 2500
  const total = subtotal + delivery

  function addItem(product) {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id)
      return found
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }]
    })
    setNotice(product.name + ' added to your bag')
  }
  function quantity(id, amount) {
    setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }
  function closeCart() { setCartOpen(false); setCheckout(false) }
  function submitOrder(event) {
    event.preventDefault()
    setOrderDone(true)
    setCheckout(false)
    setCart([])
    setNotice('Demo order saved in this browser')
  }

  return (
    <div className="storefront">
      <div className="announcement">WELCOME TO MOMO SHOP RWANDA <span>·</span> A SMARTER WAY TO SHOP</div>
      <header className="header">
        <button className="mobile-menu icon-only" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
        <a className="brand" href="#home"><span className="brand-mark">M</span><span><b>MOMO<span>SHOP</span></b><small>RWANDA</small></span></a>
        <nav className={mobileNav ? 'nav nav-open' : 'nav'}>
          <a className="active" href="#home" onClick={() => setMobileNav(false)}>Home</a>
          <a href="#products" onClick={() => setMobileNav(false)}>Shop</a>
          <a href="#categories" onClick={() => setMobileNav(false)}>Categories</a>
          <a href="#why-us" onClick={() => setMobileNav(false)}>Why us</a>
        </nav>
        <div className="header-right">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => { setSearch(e.target.value); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }} placeholder="Search products..." aria-label="Search products" /></label>
          <button className="account-btn" onClick={() => setNotice('Customer accounts will be connected in the backend stage.')}><CircleUserRound size={19} /><span>Account</span></button>
          <button className="bag-btn" onClick={() => { setOrderDone(false); setCartOpen(true) }}><ShoppingBag size={20} /><span>Bag</span><b>{count}</b></button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><i /> YOUR EVERYDAY MARKETPLACE</div>
            <h1>Good finds.<br /><em>Better living.</em></h1>
            <p>Discover useful everyday essentials, fresh styles and smart picks — all in one convenient place.</p>
            <div className="hero-links"><a className="button-primary" href="#products">Explore products <ArrowRight size={17} /></a><a className="link-arrow" href="#categories">Browse categories <ChevronDown size={15} /></a></div>
            <div className="hero-note"><span className="note-dot">M</span><span><b>Made for everyday shopping</b><small>Convenience, choice and local focus.</small></span></div>
          </div>
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1300&auto=format&fit=crop&q=90" alt="A bright, modern retail store" />
            <div className="photo-overlay"><small>THE EVERYDAY EDIT</small><strong>Find your<br />next favourite.</strong><span><ArrowRight size={18} /></span></div>
            <div className="floating-card"><Sparkles size={17} /><span>Fresh picks<br /><b>Every week</b></span></div>
            <div className="round-stamp">SHOP<strong>LOCAL</strong><small>LIVE WELL</small></div>
          </div>
        </section>

        <section className="benefits" id="why-us">
          <div><span><Truck size={19} /></span><section><b>Convenient delivery</b><small>Options shown at checkout</small></section></div>
          <div><span><ShieldCheck size={19} /></span><section><b>Safe shopping experience</b><small>Clear and transparent checkout</small></section></div>
          <div><span><CreditCard size={19} /></span><section><b>Flexible payment options</b><small>Mobile money options planned</small></section></div>
          <div><span><PackageCheck size={19} /></span><section><b>Curated product range</b><small>Essentials for daily life</small></section></div>
        </section>

        <section className="section category-section" id="categories">
          <div className="section-title"><div><small>SHOP YOUR WAY</small><h2>Explore categories</h2></div><a href="#products">View all products <ArrowRight size={16} /></a></div>
          <div className="category-grid">
            {['Electronics', 'Fashion', 'Home', 'Beauty'].map((item, index) => <button key={item} className={'category-tile tile-' + index} onClick={() => { setCategory(item); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}><small>0{index + 1} / {['TECH', 'STYLE', 'LIVING', 'CARE'][index]}</small><b>{item}</b><span><ArrowRight size={17} /></span></button>)}
          </div>
        </section>

        <section className="section products-section" id="products">
          <div className="section-title products-title"><div><small>A FEW GOOD FINDS</small><h2>Popular right now</h2><p>Thoughtful picks for your everyday.</p></div><div className="filters"><label>FILTER BY</label><div>{categories.map((item) => <button key={item} className={category === item ? 'filter active-filter' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}</div></div></div>
          {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
            <div className="product-photo"><img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}<button className="wish-btn" aria-label={'Save ' + product.name} onClick={() => setNotice('Wishlist will be available with customer accounts.')}><Heart size={17} /></button><button className="quick-add" onClick={() => addItem(product)}><Plus size={15} /> Quick add</button></div>
            <div className="product-details"><small>{product.category}</small><h3>{product.name}</h3><div className="rating"><span>★</span> {product.rating} <i>({product.reviews} reviews)</i></div><div className="product-price"><b>{money(product.price)}</b>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<button aria-label={'Add ' + product.name + ' to bag'} onClick={() => addItem(product)}><Plus size={18} /></button></div></div>
          </article>)}</div> : <div className="no-results"><Search size={25} /><h3>No products found</h3><p>Try another search term or category.</p><button onClick={() => { setSearch(''); setCategory('All products') }}>Clear filters</button></div>}
        </section>

        <section className="closing-banner"><div className="closing-mark">M</div><div><small>A MARKETPLACE WITH YOU IN MIND</small><h2>Everyday shopping,<br /><em>made simpler.</em></h2></div><a href="#products">Start exploring <ArrowRight size={17} /></a></section>
      </main>

      <footer className="footer"><div className="footer-main"><a className="brand" href="#home"><span className="brand-mark">M</span><span><b>MOMO<span>SHOP</span></b><small>RWANDA</small></span></a><p>Your everyday marketplace. Discover useful products and make shopping feel simple.</p><nav><a href="#products">Shop</a><a href="#categories">Categories</a><a href="#why-us">About us</a><a href="mailto:hello@momoshop.rw">Contact</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MOMO SHOP RWANDA. All rights reserved.</span><b>DEMO STOREFRONT · SAMPLE PRODUCTS</b></div></footer>

      {notice && <div className="toast" role="status"><Check size={17} />{notice}</div>}
      {cartOpen && <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeCart() }}><aside className="cart-drawer">
        <div className="drawer-head"><div><small>YOUR SELECTION</small><h2>{orderDone ? 'Order received' : checkout ? 'Checkout' : 'Shopping bag'}</h2></div><button className="icon-only" onClick={closeCart} aria-label="Close cart"><X size={21} /></button></div>
        {orderDone ? <div className="empty-state"><span className="empty-icon"><Check size={28} /></span><h3>Thank you for trying our demo!</h3><p>Your sample order was saved only in this browser. No real order or payment was created.</p><button className="button-primary wide" onClick={closeCart}>Continue shopping <ArrowRight size={17} /></button></div>
        : checkout ? <form className="checkout-form" onSubmit={submitOrder}><div className="demo-alert"><ShieldCheck size={17} /><span><b>Demo checkout</b><small>No real payment will be processed.</small></span></div><label>Full name<input required name="fullName" placeholder="Enter your full name" /></label><label>Phone number<input required name="phone" type="tel" placeholder="07X XXX XXXX" /></label><label>Delivery address<textarea required name="address" rows="3" placeholder="District, sector, street or landmark" /></label><label>Payment method<select name="payment" defaultValue="mtn"><option value="mtn">MTN Mobile Money (demo only)</option><option value="airtel">Airtel Money (demo only)</option><option value="cod">Cash on delivery (demo only)</option></select></label><div className="checkout-total"><span>Demo total</span><b>{money(total)}</b></div><button className="button-primary wide" type="submit">Place demo order <ArrowRight size={17} /></button><button className="back-btn" type="button" onClick={() => setCheckout(false)}>Back to bag</button></form>
        : cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><small>{item.category}</small><b>{item.name}</b><strong>{money(item.price)}</strong><div className="qty"><button onClick={() => quantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => quantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><button className="remove-btn" onClick={() => setCart((items) => items.filter((entry) => entry.id !== item.id))} aria-label={'Remove ' + item.name}><X size={16} /></button></div>)}</div><div className="cart-total"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{delivery ? money(delivery) : 'Free'}</b></div><div className="grand-total"><span>Total</span><b>{money(total)}</b></div><small>{subtotal >= 100000 ? 'You qualify for free demo delivery.' : 'Add ' + money(100000 - subtotal) + ' more for free demo delivery.'}</small><button className="button-primary wide" onClick={() => setCheckout(true)}>Continue to checkout <ArrowRight size={17} /></button><p><ShieldCheck size={14} /> Demo only — no real payment is taken.</p></div></>
        : <div className="empty-state"><span className="empty-icon"><ShoppingBag size={27} /></span><h3>Your bag is waiting</h3><p>Looks like you haven't added anything yet.</p><button className="button-primary" onClick={closeCart}>Explore products <ArrowRight size={17} /></button></div>}
      </aside></div>}
    </div>
  )
}
export default App
