cd ./dice

# Run cargo tests
cargo test

# Check if the tests were successful
if [ $? -eq 0 ]; then
    echo "No tests failed"
    
    #RUSTFLAGS="-C target-feature=+atomics,+bulk-memory,+mutable-globals" \
      #cargo +nightly build --release \
      #--target wasm32-unknown-unknown \
      #-Z build-std=panic_abort,std

    RUSTFLAGS='-C target-feature=+atomics,+bulk-memory
        -Clink-arg=--shared-memory -Clink-arg=--max-memory=268435456 -Clink-arg=--import-memory
        -Clink-arg=--export=__wasm_init_tls -Clink-arg=--export=__tls_size
        -Clink-arg=--export=__tls_align -Clink-arg=--export=__tls_base' \
      rustup run nightly-2025-11-15 \
      wasm-pack build --target web --out-dir ../../frontend/public/wasm/dice --release \
        --no-typescript
      #-- -Z build-std=panic_abort,std
    #wasm-pack build --release --target web --out-dir ../../frontend/public/wasm/dice --no-typescript

    # Generate JS glue for web + threads
    #wasm-bindgen \
    #  --target web \
    #  --out-dir ../../frontend/public/wasm/dice \
    #  --no-typescript \
    #  ../target/wasm32-unknown-unknown/release/dice.wasm

    #wasm-opt ../../frontend/public/dice.wasm \
    #  -o ../../frontend/public/dice_bg.wasm \
    #  -Oz \
    #  --enable-bulk-memory \
    #  --enable-atomics \
    #  --enable-sign-ext \
    #  --enable-threads \
    #  --enable-nontrapping-float-to-int

    #find ../../frontend/public/snippets -name "workerHelpers.js" -exec sed -i 's|import('\''../../..'\'')|import('\''../../../dice.js'\'')|g' {} +
    #find ../../frontend/src/wasm/dice/snippets -name "workerHelpers.js" -exec sed -i 's|import('\''../../..'\'')|import('\''../../../dice.js'\'')|g' {} +
    find ../../frontend/public/wasm/dice/snippets -name "workerHelpers.js" -exec sed -i 's|import('\''../../..'\'')|import('\''../../../dice.js'\'')|g' {} +


    echo "Next.js path fix applied"
    rm -rf ../../frontend/public/wasm/dice/.gitignore
    echo "Removed .gitignore from output directory"
    echo "Build successful"


else
    echo "Tests failed. Run `cargo test` to see which tests failed."
fi