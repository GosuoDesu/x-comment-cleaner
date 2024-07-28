const SwitchSelector = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => {
    return (
        <label className="switch" style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <span>{label}</span>
            <input type="checkbox" checked={checked} onChange={onChange} />
        </label>
    );
}

export default SwitchSelector;