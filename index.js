// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 1000);
});

// Progress Bar
window.addEventListener('scroll', function() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Cookie Trail Cursor
document.addEventListener('mousemove', function(e) {
    const trail = document.getElementById('cookieTrail');
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.opacity = '1';
    
    setTimeout(() => {
        trail.style.opacity = '0';
    }, 300);
});

// Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = target / 100;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(), 20);
        } else {
            counter.innerText = target;
        }
    });
}

// Trigger counter animation when in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.counter').forEach(counter => {
    observer.observe(counter);
});

// Smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function showProductDetail(productName, productImage, productDescription, productComposition) {
    document.getElementById('productDetailModalLabel').innerText = productName;
    document.getElementById('productImage').src = productImage;
    document.getElementById('productDescription').innerText = productDescription;
    document.getElementById('productComposition').innerText = productComposition;
    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
}
  

// Calculate total price in order modal
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalPrice);
});

function openOrderModal() {
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
}

// Calculate total price in order modal
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to checkboxes
    document.querySelectorAll('.product-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });
    
    // Add event listener to shipping method
    document.getElementById('shippingMethod').addEventListener('change', updateTotalPrice);
});

function updateTotalPrice() {
    let subtotal = 0;
    document.querySelectorAll('.product-checkbox:checked').forEach(checkbox => {
        subtotal += parseInt(checkbox.value);
    });

    // Get shipping cost
    const shippingMethod = document.getElementById('shippingMethod').value;
    let shippingCost = 0;
    
    if (shippingMethod.includes('Delivery')) {
        shippingCost = 10000;
    } else if (shippingMethod.includes('Kurir Ekspedisi')) {
        shippingCost = 15000;
    }

    const total = subtotal + shippingCost;
    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Show price breakdown
    const breakdown = document.getElementById('priceBreakdown');
    if (subtotal > 0) {
        breakdown.textContent = `Subtotal: Rp ${subtotal.toLocaleString('id-ID')} | Ongkir: Rp ${shippingCost.toLocaleString('id-ID')}`;
    } else {
        breakdown.textContent = '';
    }
}

function processOrder() {
    const selectedProducts = [];
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const buyerAddress = document.getElementById('buyerAddress').value.trim();
    const shippingMethod = document.getElementById('shippingMethod').value;

    // Validasi input
    if (checkboxes.length === 0) {
        alert('Pilih minimal satu produk!');
        return;
    }

    if (!buyerName) {
        alert('Nama lengkap harus diisi!');
        document.getElementById('buyerName').focus();
        return;
    }

    if (!buyerPhone) {
        alert('Nomor WhatsApp harus diisi!');
        document.getElementById('buyerPhone').focus();
        return;
    }

    if (!buyerAddress) {
        alert('Alamat lengkap harus diisi!');
        document.getElementById('buyerAddress').focus();
        return;
    }

    if (!shippingMethod) {
        alert('Pilih metode pengiriman!');
        document.getElementById('shippingMethod').focus();
        return;
    }

    // Kumpulkan produk yang dipilih
    checkboxes.forEach(checkbox => {
        const productName = checkbox.nextElementSibling.textContent.trim();
        selectedProducts.push(productName);
    });

    // Hitung total harga
    let subtotal = 0;
    checkboxes.forEach(checkbox => {
        subtotal += parseInt(checkbox.value);
    });

    // Hitung ongkir
    let shippingCost = 0;
    if (shippingMethod.includes('Delivery')) {
        shippingCost = 10000;
    } else if (shippingMethod.includes('Kurir Ekspedisi')) {
        shippingCost = 15000;
    }

    const total = subtotal + shippingCost;

    // Format pesan WhatsApp
    const message = `🍪 *PESANAN COOKIE LAB* 🍪

📋 *DETAIL PESANAN:*
${selectedProducts.map((product, index) => `${index + 1}. ${product}`).join('\n')}

💰 *RINCIAN HARGA:*
Subtotal Produk: Rp ${subtotal.toLocaleString('id-ID')}
Ongkos Kirim: Rp ${shippingCost.toLocaleString('id-ID')}
*TOTAL BAYAR: Rp ${total.toLocaleString('id-ID')}*

👤 *DATA PEMBELI:*
Nama: ${buyerName}
No. WhatsApp: ${buyerPhone}
Alamat: ${buyerAddress}

🚚 *METODE PENGIRIMAN:*
${shippingMethod}

Terima kasih sudah memesan di Cookie Lab! 😊`;

    // Debug log
    console.log('Sending message:', message);

    // Kirim ke WhatsApp
    const whatsappUrl = `https://wa.me/6285798329197?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Close modal after sending
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    modal.hide();
}
  
// Add to cart buttons
document.querySelectorAll('.btn-outline-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        this.innerHTML = '<i class="bi bi-check"></i> Added!';
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-success');
        
        setTimeout(() => {
            this.innerHTML = 'Add to Cart';
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
        }, 2000);
    });
});

// Text animation
const textElement = document.querySelector('.text-animation');
if (textElement) {
    const text = textElement.textContent;
    textElement.innerHTML = text.split('').map((char, i) => 
        `<span style="animation-delay: ${i * 0.1}s">${char}</span>`
    ).join('');
}