# Maintainer: Pavan Rikhi <pavan.rikhi@gmail.com>
pkgname=pencil
pkgver=2.0.19
pkgrel=1
pkgdesc="Sketching and GUI prototyping/wireframing tool"
arch=('any')
license=('GPL2')
url="http://github.com/prikhi/pencil"
install='pencil.install'

source=("https://github.com/prikhi/pencil/releases/download/v$pkgver/Pencil-$pkgver-linux-pkg.tar.gz")
sha256sums=('8b7cab37f1ba9db7b4113972931c026da231e646202cd1ef2a78189264e92b45')
depends=('xulrunner')
optdepends=('pencil-android-lollipop-stencils-git: Android UI'
            'pencil-material-icons-git: Material Design Icons')

package() {
    cp -dr "$srcdir/evolus-pencil/usr" "$pkgdir"
    # fix permissions of directories
    chmod -R a+rX "$pkgdir"/*
}
